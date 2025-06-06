// server.ts – TPTP Language Server
import {
  createConnection,
  TextDocuments,
  Diagnostic,
  DiagnosticSeverity,
  ProposedFeatures,
  InitializeParams,
  DidChangeConfigurationNotification,
  CompletionItem,
  CompletionItemKind,
  TextDocumentPositionParams,
  TextDocumentSyncKind,
  InitializeResult,
  DocumentFormattingParams,
  TextEdit,
  Range,
  Position,
} from 'vscode-languageserver/node';

import {
  TextDocument
} from 'vscode-languageserver-textdocument';

// Create connection and document manager
const connection = createConnection(ProposedFeatures.all);
const documents: TextDocuments<TextDocument> = new TextDocuments(TextDocument);

let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;

connection.onInitialize((params: InitializeParams) => {
  const capabilities = params.capabilities;

  hasConfigurationCapability = !!(
    capabilities.workspace && !!capabilities.workspace.configuration
  );
  hasWorkspaceFolderCapability = !!(
    capabilities.workspace && !!capabilities.workspace.workspaceFolders
  );
  hasDiagnosticRelatedInformationCapability = !!(
    capabilities.textDocument &&
    capabilities.textDocument.publishDiagnostics &&
    capabilities.textDocument.publishDiagnostics.relatedInformation
  );

  const result: InitializeResult = {
    capabilities: {
      textDocumentSync: TextDocumentSyncKind.Incremental,
      completionProvider: {
        resolveProvider: true
      },
      documentFormattingProvider: true,
      documentRangeFormattingProvider: true,
    }
  };
  if (hasWorkspaceFolderCapability) {
    result.capabilities.workspace = {
      workspaceFolders: {
        supported: true
      }
    };
  }
  return result;
});

connection.onInitialized(() => {
  if (hasConfigurationCapability) {
    connection.client.register(DidChangeConfigurationNotification.type, undefined);
  }
  if (hasWorkspaceFolderCapability) {
    connection.workspace.onDidChangeWorkspaceFolders(_event => {
      connection.console.log('Workspace folder change event received.');
    });
  }
});

// TPTP Parser and Validator
class TPTPValidator {
  private diagnostics: Diagnostic[] = [];

  public validateDocument(textDocument: TextDocument): Diagnostic[] {
    this.diagnostics = [];
    const rawLines = textDocument.getText().split(/\r?\n/);

    let buffer = "";
    let insideFormula = false;
    let startLine = 0;

    for (let i = 0; i < rawLines.length; i++) {
      const raw = rawLines[i];
      const line = raw.trim();

      // 1) If the line is empty or a “%…” comment, skip unless we are already building a buffer
      if (line === "" || line.startsWith("%")) {
        if (insideFormula) {
          // preserve one space so that tokens don’t run together
          buffer += " ";
        }
        continue;
      }

      // NEW: if we are already insideFormula, but this new trimmed line ALSO looks like the start of a fresh formula,
      // then we must first “flush” the old buffer (it never ended with a period).
      if (insideFormula && this.isFormulaLine(line)) {
        // The old buffer never saw “endsWith('.')” with balanced parentheses → missing-period
        const trimmedOld = buffer.trimEnd();
        this.diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: startLine, character: trimmedOld.length },
            end:   { line: startLine, character: trimmedOld.length }
          },
          message: 'TPTP formula must end with a period (.)',
          source: 'tptp-lsp'
        });
        // Reset and fall through so that this line becomes the start of the new formula
        insideFormula = false;
        buffer = "";
      }

      // 2) If we are not yet inside a formula, check if this trimmed line is the start of one
      if (!insideFormula) {
        if (this.isFormulaLine(line) || this.isIncludeLine(line)) {
          insideFormula = true;
          startLine = i;
          buffer = line;
        } else {
          // not a formula’s first line; ignore entirely
          continue;
        }
      }
      else {
        // 3) We are already collecting lines: append a space + trimmed text
        buffer += " " + line;
      }

      // 4) Now check if “buffer” is complete: it must end with a period AND parentheses must balance.
      const trimmedBuffer = buffer.trimEnd();
      const parenCheck = this.checkParenthesesBalance(trimmedBuffer);

      if (trimmedBuffer.endsWith(".") && !parenCheck.error) {
        // We have a complete formula (or include). Dispatch to validateFormula or validateInclude,
        // always using startLine as the line number for diagnostics.

        if (this.isFormulaLine(trimmedBuffer)) {
          this.validateFormula(trimmedBuffer, startLine, textDocument);
        }
        else if (this.isIncludeLine(trimmedBuffer)) {
          this.validateInclude(trimmedBuffer, startLine, textDocument);
        }

        // Reset for next formula
        insideFormula = false;
        buffer = "";
      }
      // else keep accumulating until we see “.)” with balanced parentheses
    }

    // 5) If we hit EOF while still “insideFormula,” do one final validation call
    if (insideFormula && buffer.trim() !== "") {
      const trimmedBuffer = buffer.trimEnd();
      // We know it never saw “endsWith('.')” earlier, so we must report missing-period now:
      if (!trimmedBuffer.endsWith(".")) {
        this.diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: startLine, character: trimmedBuffer.length },
            end:   { line: startLine, character: trimmedBuffer.length }
          },
          message: 'TPTP formula must end with a period (.)',
          source: 'tptp-lsp'
        });
      }
      // Then still attempt the remaining structural checks if it did end with “.” but was unbalanced, etc.
      if (this.isFormulaLine(trimmedBuffer)) {
        this.validateFormula(trimmedBuffer, startLine, textDocument);
      } else if (this.isIncludeLine(trimmedBuffer)) {
        this.validateInclude(trimmedBuffer, startLine, textDocument);
      }
    }

    return this.diagnostics;
  }

  private isFormulaLine(line: string): boolean {
    return /^(tpi|thf|tff|tcf|fof|cnf)\s*\(/.test(line);
  }

  private isIncludeLine(line: string): boolean {
    return /^include\s*\(/.test(line);
  }

  private validateFormula(line: string, lineNum: number, document: TextDocument) {
    // 1) Trim trailing whitespace/newlines before checking “endsWith('.')”
    const trimmedLine = line.trimEnd();

    // If it does not end in '.', we already reported above. Now run the rest of the checks on trimmedLine:
    if (!trimmedLine.endsWith(".")) {
      // (This branch is rarely reached here because the “missing-period” was already emitted above,
      //  but we keep it for completeness.)
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: trimmedLine.length },
          end:   { line: lineNum, character: trimmedLine.length }
        },
        message: 'TPTP formula must end with a period (.)',
        source: 'tptp-lsp'
      });
    }

    // 2) Check it starts with a valid TPTP type
    const typeMatch = trimmedLine.match(/^(tpi|thf|tff|tcf|fof|cnf)\s*/);
    if (!typeMatch) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: 0 },
          end:   { line: lineNum, character: trimmedLine.length }
        },
        message: 'TPTP formula must start with tpi, thf, tff, tcf, fof, or cnf',
        source: 'tptp-lsp'
      });
      return;
    }

    const type = typeMatch[1];
    const afterType = trimmedLine.substring(typeMatch[0].length);
    if (!afterType.startsWith('(')) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: typeMatch[0].length },
          end:   { line: lineNum, character: typeMatch[0].length + 1 }
        },
        message: `Missing opening parenthesis after '${type}'`,
        source: 'tptp-lsp'
      });
      return;
    }

    // 3) Check for balanced parentheses
    const parenBalance = this.checkParenthesesBalance(trimmedLine);
    if (parenBalance.error) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: parenBalance.position },
          end:   { line: lineNum, character: parenBalance.position + 1 }
        },
        message: parenBalance.message,
        source: 'tptp-lsp'
      });
      return;
    }

    // 4) Check the overall structure “type(name, role, formula).”
    const formulaMatch = trimmedLine.match(
      /^(tpi|thf|tff|tcf|fof|cnf)\s*\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*(.+)\)\s*\.\s*$/
    );
    if (!formulaMatch) {
      if (trimmedLine.includes(",")) {
        this.diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: 0 },
            end:   { line: lineNum, character: trimmedLine.length }
          },
          message: 'Invalid TPTP formula structure. Expected: type(name, role, formula).',
          source: 'tptp-lsp'
        });
      } else {
        this.diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: 0 },
            end:   { line: lineNum, character: trimmedLine.length }
          },
          message: 'TPTP formula must have format: type(name, role, formula). Missing commas or parentheses.',
          source: 'tptp-lsp'
        });
      }
      return;
    }

    const [, , name, role, formulaBody] = formulaMatch;

    // 5) Validate “role” (just warn if it’s not in the known list)
    const validRoles = [
      'axiom','hypothesis','definition','assumption','lemma','theorem',
      'corollary','conjecture','negated_conjecture','plain','type',
      'fi_domain','fi_functors','fi_predicates','unknown'
    ];
    if (!validRoles.includes(role)) {
      const roleStart = trimmedLine.indexOf(role);
      this.diagnostics.push({
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { line: lineNum, character: roleStart },
          end:   { line: lineNum, character: roleStart + role.length }
        },
        message: `Unknown TPTP role '${role}'. Valid roles: ${validRoles.join(', ')}`,
        source: 'tptp-lsp'
      });
    }

    // 6) Finally check inside the formula body for unmatched quotes, invalid operator sequences, etc.
    this.validateFormulaContent(
      formulaBody,
      lineNum,
      trimmedLine.indexOf(formulaBody),
      document
    );
  }

  private validateFormulaContent(formula: string, lineNum: number, startChar: number, document: TextDocument) {
    // Check for unmatched single quotes
    const singleQuotes = (formula.match(/'/g) || []).length;
    if (singleQuotes % 2 !== 0) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: startChar },
          end:   { line: lineNum, character: startChar + formula.length }
        },
        message: 'Unmatched single quote in formula',
        source: 'tptp-lsp'
      });
    }

    // Check for unmatched double quotes
    const doubleQuotes = (formula.match(/"/g) || []).length;
    if (doubleQuotes % 2 !== 0) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: startChar },
          end:   { line: lineNum, character: startChar + formula.length }
        },
        message: 'Unmatched double quote in formula',
        source: 'tptp-lsp'
      });
    }

    // Check for invalid operator sequences (e.g. “&&&”, “===”, “~~”)
    const invalidOperators = formula.match(/[&|]{3,}|={3,}|~{2,}/g);
    if (invalidOperators) {
      invalidOperators.forEach(op => {
        const opIndex = formula.indexOf(op);
        this.diagnostics.push({
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: startChar + opIndex },
            end:   { line: lineNum, character: startChar + opIndex + op.length }
          },
          message: `Invalid operator sequence: ${op}`,
          source: 'tptp-lsp'
        });
      });
    }
  }

  private validateInclude(line: string, lineNum: number, document: TextDocument) {
    if (!line.endsWith('.')) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: line.length },
          end:   { line: lineNum, character: line.length }
        },
        message: 'Include statement must end with a period (.)',
        source: 'tptp-lsp'
      });
    }

    // Check include syntax: include('filename').
    if (!/^include\s*\(\s*'[^']+'\s*\)\s*\.\s*$/.test(line)) {
      this.diagnostics.push({
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: 0 },
          end:   { line: lineNum, character: line.length }
        },
        message: "Include statement must have format: include('filename').",
        source: 'tptp-lsp'
      });
    }
  }

  private checkParenthesesBalance(line: string): { error: boolean; position: number; message: string } {
    let balance = 0;
    let inSingleQuote = false;
    let inDoubleQuote = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const prevChar = i > 0 ? line[i - 1] : '';

      // Handle quotes (ignore escaped quotes)
      if (char === "'" && prevChar !== '\\') {
        inSingleQuote = !inSingleQuote;
      } else if (char === '"' && prevChar !== '\\') {
        inDoubleQuote = !inDoubleQuote;
      }

      // Skip parentheses inside quotes
      if (inSingleQuote || inDoubleQuote) continue;

      if (char === '(') {
        balance++;
      } else if (char === ')') {
        balance--;
        if (balance < 0) {
          return {
            error: true,
            position: i,
            message: 'Unmatched closing parenthesis'
          };
        }
      }
    }

    if (balance > 0) {
      return {
        error: true,
        position: line.length - 1,
        message: 'Missing closing parenthesis'
      };
    }

    return { error: false, position: -1, message: '' };
  }
}

const validator = new TPTPValidator();

// Document change handler
documents.onDidChangeContent(change => {
  validateTextDocument(change.document);
});

async function validateTextDocument(textDocument: TextDocument): Promise<void> {
  const diagnostics = validator.validateDocument(textDocument);
  connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}

// Basic completion support
connection.onCompletion(
  (_textDocumentPosition: TextDocumentPositionParams): CompletionItem[] => {
    return [
      {
        label: 'fof',
        kind: CompletionItemKind.Keyword,
        data: 1,
        insertText: 'fof(${1:name}, ${2:axiom}, ${3:formula}).',
        insertTextFormat: 2 // Snippet format
      },
      {
        label: 'thf',
        kind: CompletionItemKind.Keyword,
        data: 2,
        insertText: 'thf(${1:name}, ${2:axiom}, ${3:formula}).',
        insertTextFormat: 2
      },
      {
        label: 'tff',
        kind: CompletionItemKind.Keyword,
        data: 3,
        insertText: 'tff(${1:name}, ${2:axiom}, ${3:formula}).',
        insertTextFormat: 2
      },
      {
        label: 'cnf',
        kind: CompletionItemKind.Keyword,
        data: 4,
        insertText: 'cnf(${1:name}, ${2:axiom}, ${3:clause}).',
        insertTextFormat: 2
      },
      {
        label: 'include',
        kind: CompletionItemKind.Keyword,
        data: 5,
        insertText: "include('${1:filename}').",
        insertTextFormat: 2
      },
      {
        label: 'tpi',
        kind: CompletionItemKind.Keyword,
        data: 6,
        insertText: 'tpi(${1:name}, ${2:axiom}, ${3:clause}).',
        insertTextFormat: 2
      },
      {
        label: 'tcf',
        kind: CompletionItemKind.Keyword,
        data: 7,
        insertText: 'tcf(${1:name}, ${2:axiom}, ${3:clause}).',
        insertTextFormat: 2
      },
    ];
  }
);

connection.onCompletionResolve(
  (item: CompletionItem): CompletionItem => {
    const descriptions = {
      1: 'First-order formula declaration',
      2: 'Typed higher-order formula declaration',
      3: 'Typed first-order formula declaration',
      4: 'Clause normal form declaration',
      5: 'Include another TPTP file'
    };
    
    if (item.data && descriptions[item.data as keyof typeof descriptions]) {
      item.detail = descriptions[item.data as keyof typeof descriptions];
    }
    
    return item;
  }
);

function prettyPrintTPTP(input: string): string {
  const indentUnit = "    ";   // 4 spaces
  const maxLineLength = 20;    // threshold for breaking formula to new line
  let indentLevel = 0;
  let parenDepth = 0;          // actual ( ... ) depth
  let out = "";
  let inString = false;        // tracking '...' or "..."
  let strChar = "";            // either "'" or '"'
  let inLineComment = false;
  let inBlockComment = false;
  let isInTPTPFormula = false;  // track if we're in the formula part of TPTP declaration
  let tptpCommaCount = 0;       // count commas in TPTP declaration to identify formula part
  let bracketDepth = 0;
  let justEndedFormula = false; // track if we just ended a formula with a period

  // Helper: peek ahead, skipping any whitespace
  function peekNonWhitespace(idx: number): string | null {
    let j = idx;
    while (j < input.length && /\s/.test(input[j])) { j++; }
    return j < input.length ? input[j] : null;
  }

  // Helper: check if current position is start of TPTP declaration
  function isAtTPTPStart(idx: number): boolean {
    const patterns = ["tpi(", "thf(", "tff(", "tcf(", "fof(", "cnf("];
    return patterns.some(pattern => input.substring(idx, idx + pattern.length) === pattern);
  }

  // Helper: get the length of the TPTP declaration type
  function getTPTPDeclLength(idx: number): number {
    const patterns = ["tpi(", "thf(", "tff(", "tcf(", "fof(", "cnf("];
    for (const pattern of patterns) {
      if (input.substring(idx, idx + pattern.length) === pattern) {
        return pattern.length;
      }
    }
    return 0;
  }

  // Helper: estimate current line length from last newline
  function getCurrentLineLength(): number {
    const lastNewlineIdx = out.lastIndexOf('\n');
    if (lastNewlineIdx === -1) return out.length;
    return out.length - lastNewlineIdx - 1;
  }

  // Helper: check if there's already a blank line at the end of output
  function hasBlankLineAtEnd(): boolean {
    const lines = out.split('\n');
    return lines.length >= 2 && lines[lines.length - 1] === '' && lines[lines.length - 2] === '';
  }

  // Preserve empty lines by tracking consecutive newlines
  function preserveEmptyLines(startIdx: number): number {
    let i = startIdx;
    let newlineCount = 0;
    
    // Count newlines (but skip other whitespace)
    while (i < input.length) {
      if (input[i] === '\n') {
        newlineCount++;
        i++;
      } else if (/[ \t\r]/.test(input[i])) {
        // Skip other whitespace but don't count it
        i++;
      } else {
        break;
      }
    }
    
    // If we have more than one newline, preserve the extras as empty lines
    if (newlineCount > 1) {
      // Add the extra newlines (newlineCount - 1 because we already have one)
      for (let j = 1; j < newlineCount && j < 3; j++) {
        out += '\n';
      }
    }
    
    return i;
  }

  // We iterate char by char, but sometimes lookahead ("=>" etc.)
  for (let i = 0; i < input.length; ) {
    const ch = input[i];
    const next = input[i + 1] ?? "";

    if (ch === "[") {
      bracketDepth++;
      out += ch;
      i++;
      continue;
    }

    if (ch === "]") {
      bracketDepth = Math.max(bracketDepth - 1, 0);
      out += ch;
      i++;
      continue;
    }

    //
    // 1) Single‐line comment "% …" (only if it occurs at line‐start or after a newline)
    //
    if (
      !inString &&
      !inBlockComment &&
      ch === "%" &&
      (i === 0 || input[i - 1] === "\n")
    ) {
      inLineComment = true;
      // Copy "%" + everything until end‐of‐line
      while (i < input.length && input[i] !== "\n") {
        out += input[i++];
      }
      // Copy the newline too (if any)
      if (i < input.length && input[i] === "\n") {
        out += "\n";
        i++;
      }
      inLineComment = false;
      continue;
    }

    //
    // 2) Block comment start "/* … */"
    //
    if (!inString && !inLineComment && !inBlockComment && ch === "/" && next === "*") {
      inBlockComment = true;
      out += "/*";
      i += 2;
      // Copy until matching "*/"
      while (i < input.length) {
        if (input[i] === "*" && input[i + 1] === "/") {
          out += "*/";
          i += 2;
          inBlockComment = false;
          break;
        } else {
          out += input[i++];
        }
      }
      continue;
    }

    //
    // 3) If already inside a block comment, copy verbatim until it ends
    //
    if (inBlockComment) {
      out += ch;
      i++;
      continue;
    }

    //
    // 4) Toggle inString on unescaped ' or "
    //
    if (!inLineComment && (ch === "'" || ch === '"') && input[i - 1] !== "\\") {
      if (!inString) {
        inString = true;
        strChar = ch;
        out += ch;
        i++;
        continue;
      } else if (inString && ch === strChar) {
        inString = false;
        strChar = "";
        out += ch;
        i++;
        continue;
      }
    }
    if (inString) {
      // Inside a string → copy verbatim
      out += ch;
      i++;
      continue;
    }

    //
    // 5) Handle TPTP declaration detection and comma counting
    //
    if (isAtTPTPStart(i)) {
      // If we just ended a formula and are starting a new one, ensure blank line
      if (justEndedFormula && !hasBlankLineAtEnd()) {
        out += "\n";
      }
      justEndedFormula = false;

      const declLength = getTPTPDeclLength(i);
      out += input.substring(i, i + declLength); // e.g., "fof("
      i += declLength;

      tptpCommaCount = 0;
      isInTPTPFormula = false;
      parenDepth = 1;
      indentLevel = 1;

      // Parse and keep first two arguments (name, role) inline
      let arg = "";
      let commasSeen = 0;

      while (i < input.length && commasSeen < 2) {
        const ch2 = input[i];

        if (ch2 === ",") {
          out += arg.trim() + ", ";
          arg = "";
          commasSeen++;
          i++;
        } else {
          arg += ch2;
          i++;
        }
      }

      // After second comma, break to a new line and indent for the formula
      out += "\n" + indentUnit.repeat(indentLevel);
      isInTPTPFormula = true;

      continue;
    }


    //
    // 6) Handle "=>" (implication): break‐before, indent at current level, then print "=>", then a space
    //
    if (ch === "=" && next === ">") {
      // newline + indent
      out += "\n" + indentUnit.repeat(Math.max(1, indentLevel - 3)) + " =>";
      i += 2;
      // skip any whitespace that follows
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
      out += " ";
      continue;
    }

    //
    // 7) Handle disjunction "|": break‐before, indent one deeper than current level, then "| "
    //
    if (ch === "|") {
      out += "\n" + indentUnit.repeat(Math.max(1, indentLevel - 3)) + "|";
      i++;
      // skip following whitespace
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
      out += " ";
      continue;
    }

    // 7.1) Handle conjunction "&": break‐before, indent one deeper than current level, then "& "
    if (ch === "&") {
      out += "\n" + indentUnit.repeat(Math.max(1, indentLevel - 3)) + "&";
      i++;
      // skip any whitespace that follows
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
      out += " ";
      continue;
    }

    // 7.2) Handle conjunction ":": keep ":" on current line, then newline + indent
    if (ch === ":") {
      out += " :";
      i++;
      // skip any whitespace that follows
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
      out += "\n" + indentUnit.repeat(Math.max(1, indentLevel - 3));
      continue;
    }

    // 7.3) Handle quantifiers ?[ ... ], ![ ... ], ^[ ... ]
    if ((ch === "?" || ch === "!" || ch === "^" || ch === "~") && peekNonWhitespace(i + 1) === "[") {
      out += ch + " ";
      i++;

      // skip any whitespace between quantifier and bracket
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }

      if (input[i] === "[") {
        out += "[";
        bracketDepth++;
        i++;
        continue;
      }
    }
    
    // 7.4) Add spaces before special symbols
    if (
      (ch === "=" && input[i - 1] !== "<" && input[i - 1] !== "!" && input[i - 1] !== ">") ||
      (ch === "!" && next === "=") ||
      (ch === "<" && next === "=") ||
      (ch === ">" && next === "=")
    ) {
      const op = (ch === "!" || ch === "<" || ch === ">") ? ch + next : ch;
      out += " " + op + " ";
      i += op.length;
      continue;
    }
    
    //
    // 8) Opening parenthesis "(":  increase parenDepth & indentLevel, print "("
    //    Then, if the next real (non‐whitespace) character is a letter or "!", insert a single space.
    //
    if (ch === "(") {
      out += "(";
      parenDepth++;
      // indentLevel++;
      i++;

      // Peek the next non‐ws character; if it's a letter or "!", insert exactly one space:
      const nn = peekNonWhitespace(i);
      if (nn !== null && /[A-Za-z!]/.test(nn)) {
        // out += " ";
      }
      continue;
    }

    //~ DONT WANT THIS FOR NOW
    // 9) Closing parenthesis ")": break‐before at (level−1), then print ")"
    // if (ch === ")") {
    //   let closeCount = 0;
    //   // Count consecutive closing parens
    //   while (input[i + closeCount] === ")") {
    //     closeCount++;
    //   }

    //   // If followed by a period, group them all together
    //   const followsPeriod = input[i + closeCount] === ".";

    //   // Write the closing parens on the same line
    //   out += " ".repeat(1); // optional space before
    //   for (let j = 0; j < closeCount; j++) {
    //     parenDepth = Math.max(parenDepth - 1, 0);
    //     indentLevel = Math.max(indentLevel - 1, 0);
    //     out += ")";
    //   }

    //   i += closeCount;

    //   // If there's a period, append it too
    //   if (followsPeriod) {
    //     out += ".\n";
    //     i++; // skip '.'
    //     isInTPTPFormula = false;
    //     tptpCommaCount = 0;
    //   }

    //   continue;
    // }


    //
    // 10) Comma ",":
    //     • Track TPTP comma count and handle formula formatting
    //     • if parenDepth === 1  → this is the top‐level comma inside "tptp( name, role, formula )": emit "," + newline + indent(at same level)
    //     • else (nested comma) → emit ", " (comma + single space) on the same line
    //
    if (ch === ",") {
      if (parenDepth === 1 && bracketDepth === 0) {
        // top‐level comma in "tptp(...)"
        tptpCommaCount++;
        out += ",";
        
        // If this is the second comma (before formula), check line length
        if (tptpCommaCount === 2) {
          const currentLineLength = getCurrentLineLength();
          if (currentLineLength > maxLineLength) {
            out += "\n" + indentUnit.repeat(indentLevel);
            isInTPTPFormula = true;
          } else {
            out += "\n" + indentUnit.repeat(indentLevel);
            isInTPTPFormula = true;
          }
        } else {
          out += "\n" + indentUnit.repeat(indentLevel);
        }
        i++;
      } else {
        // nested comma, keep on same line
        out += ", ";
        i++;
        // skip any whitespace that follows
        while (i < input.length && /\s/.test(input[i])) {
          i++;
        }
      }
      continue;
    }

    //
    // 11) Period "." → print "." then newline, reset TPTP state
    //
    if (ch === ".") {
      out += ".";
      out += "\n";
      isInTPTPFormula = false;
      tptpCommaCount = 0;
      justEndedFormula = true; // Mark that we just ended a formula
      i++;
      continue;
    }

    //
    // 12) Whitespace (spaces, tabs, newlines):
    //      Handle empty line preservation and normal whitespace collapse
    //
    if (/\s/.test(ch)) {
      // Check for multiple consecutive newlines to preserve empty lines
      if (ch === '\n') {
        const preservedIdx = preserveEmptyLines(i);
        if (preservedIdx > i + 1) {
          // We preserved multiple newlines, skip ahead
          i = preservedIdx;
          continue;
        }
      }
      
      // Skip all remaining whitespace in input
      while (i < input.length && /\s/.test(input[i])) {
        i++;
      }
      
      // Now decide whether to insert exactly one space:
      const lastCh = out.length > 0 ? out[out.length - 1] : "\n";
      if (
        lastCh !== " " &&
        lastCh !== "\n" &&
        lastCh !== "("
      ) {
        // Insert one space if the next real char is alphanumeric or "$" or "<" etc.
        const nn = peekNonWhitespace(i);
        if (nn !== null && /[A-Za-z0-9\$<]/.test(nn)) {
          out += " ";
        }
      }
      continue;
    }

    //
    // 13) Default: any other character—just copy verbatim
    //
    out += ch;
    i++;
  }

  // Trim trailing whitespace/newlines, then append exactly one newline at end
  return out.replace(/\s*$/, "") + "\n";
}

connection.onDocumentFormatting((params: DocumentFormattingParams): TextEdit[] => {
  const uri = params.textDocument.uri;
  const doc = documents.get(uri);
  if (!doc) {
    return [];
  }
  const fullText = doc.getText();
  const formatted = prettyPrintTPTP(fullText);

  // Replace the entire document
  const lastLine = doc.lineCount - 1;
  const lastChar = doc.getText({
    start: { line: lastLine, character: 0 },
    end:   { line: lastLine + 1, character: 0 },
  }).length;
  const fullRange: Range = {
    start: Position.create(0, 0),
    end:   Position.create(lastLine, lastChar),
  };

  return [TextEdit.replace(fullRange, formatted)];
});

//
// (Optional) Range-only formatting if you want to format a selected region
//
connection.onDocumentRangeFormatting((params, _token) => {
  const doc = documents.get(params.textDocument.uri);
  if (!doc) return [];
  const textRange = doc.getText(params.range);
  const formattedRangeText = prettyPrintTPTP(textRange);
  return [TextEdit.replace(params.range, formattedRangeText)];
});


// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
connection.listen();
