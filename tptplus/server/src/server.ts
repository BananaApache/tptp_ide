// server.ts - TPTP Language Server
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
  InitializeResult
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
      }
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

  validateDocument(textDocument: TextDocument): Diagnostic[] {
    this.diagnostics = [];
    const text = textDocument.getText();
    const lines = text.split('\n');

    for (let lineNum = 0; lineNum < lines.length; lineNum++) {
      const line = lines[lineNum].trim();
      if (line === '' || line.startsWith('%')) continue;

      this.validateLine(line, lineNum, textDocument);
    }

    return this.diagnostics;
  }

  private validateLine(line: string, lineNum: number, document: TextDocument) {
    // Check for TPTP formula structure
    if (this.isFormulaLine(line)) {
      this.validateFormula(line, lineNum, document);
    } else if (this.isIncludeLine(line)) {
      this.validateInclude(line, lineNum, document);
    }
  }

  private isFormulaLine(line: string): boolean {
    return /^(thf|tff|fof|cnf)\s*\(/.test(line);
  }

  private isIncludeLine(line: string): boolean {
    return /^include\s*\(/.test(line);
  }

  private validateFormula(line: string, lineNum: number, document: TextDocument) {
    // Check if formula ends with period
    if (!line.endsWith('.')) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: line.length },
          end: { line: lineNum, character: line.length }
        },
        message: 'TPTP formula must end with a period (.)',
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
    }

    // First check if it starts with a valid TPTP type
    const typeMatch = line.match(/^(thf|tff|fof|cnf)\s*/);
    if (!typeMatch) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: 0 },
          end: { line: lineNum, character: line.length }
        },
        message: 'TPTP formula must start with thf, tff, fof, or cnf',
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
      return;
    }

    const type = typeMatch[1];
    const afterType = line.substring(typeMatch[0].length);

    // Check if there's an opening parenthesis immediately after the type
    if (!afterType.startsWith('(')) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: typeMatch[0].length },
          end: { line: lineNum, character: typeMatch[0].length + 1 }
        },
        message: `Missing opening parenthesis after '${type}'`,
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
      return;
    }

    // Check for balanced parentheses
    const parenBalance = this.checkParenthesesBalance(line);
    if (parenBalance.error) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: parenBalance.position },
          end: { line: lineNum, character: parenBalance.position + 1 }
        },
        message: parenBalance.message,
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
      return;
    }

    // Check formula structure: type(name, role, formula).
    const formulaMatch = line.match(/^(thf|tff|fof|cnf)\s*\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*(.+)\)\s*\.?\s*$/);
    if (!formulaMatch) {
      // More specific error messages
      if (line.includes(',')) {
        // Has commas but wrong structure
        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: 0 },
            end: { line: lineNum, character: line.length }
          },
          message: 'Invalid TPTP formula structure. Expected: type(name, role, formula).',
          source: 'tptp-lsp'
        };
        this.diagnostics.push(diagnostic);
      } else {
        // Missing commas entirely
        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: 0 },
            end: { line: lineNum, character: line.length }
          },
          message: 'TPTP formula must have format: type(name, role, formula). Missing commas or parentheses.',
          source: 'tptp-lsp'
        };
        this.diagnostics.push(diagnostic);
      }
      return;
    }

    const [, , name, role, formula] = formulaMatch;

    // Validate role
    const validRoles = [
      'axiom', 'hypothesis', 'definition', 'assumption', 'lemma', 'theorem',
      'corollary', 'conjecture', 'negated_conjecture', 'plain', 'type',
      'fi_domain', 'fi_functors', 'fi_predicates', 'unknown'
    ];

    if (!validRoles.includes(role)) {
      const roleStart = line.indexOf(role);
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Warning,
        range: {
          start: { line: lineNum, character: roleStart },
          end: { line: lineNum, character: roleStart + role.length }
        },
        message: `Unknown TPTP role '${role}'. Valid roles: ${validRoles.join(', ')}`,
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
    }

    // Check for common syntax errors in formula
    this.validateFormulaContent(formula, lineNum, line.indexOf(formula), document);
  }

  private validateFormulaContent(formula: string, lineNum: number, startChar: number, document: TextDocument) {
    // Check for unmatched quotes
    const singleQuotes = (formula.match(/'/g) || []).length;
    const doubleQuotes = (formula.match(/"/g) || []).length;

    if (singleQuotes % 2 !== 0) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: startChar },
          end: { line: lineNum, character: startChar + formula.length }
        },
        message: 'Unmatched single quote in formula',
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
    }

    if (doubleQuotes % 2 !== 0) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: startChar },
          end: { line: lineNum, character: startChar + formula.length }
        },
        message: 'Unmatched double quote in formula',
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
    }

    // Check for invalid operators
    const invalidOperators = formula.match(/[&|]{3,}|={3,}|~{2,}/g);
    if (invalidOperators) {
      invalidOperators.forEach(op => {
        const opIndex = formula.indexOf(op);
        const diagnostic: Diagnostic = {
          severity: DiagnosticSeverity.Error,
          range: {
            start: { line: lineNum, character: startChar + opIndex },
            end: { line: lineNum, character: startChar + opIndex + op.length }
          },
          message: `Invalid operator sequence: ${op}`,
          source: 'tptp-lsp'
        };
        this.diagnostics.push(diagnostic);
      });
    }
  }

  private validateInclude(line: string, lineNum: number, document: TextDocument) {
    if (!line.endsWith('.')) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: line.length },
          end: { line: lineNum, character: line.length }
        },
        message: 'Include statement must end with a period (.)',
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
    }

    // Check include syntax: include('filename').
    if (!/^include\s*\(\s*'[^']+'\s*\)\s*\.\s*$/.test(line)) {
      const diagnostic: Diagnostic = {
        severity: DiagnosticSeverity.Error,
        range: {
          start: { line: lineNum, character: 0 },
          end: { line: lineNum, character: line.length }
        },
        message: "Include statement must have format: include('filename').",
        source: 'tptp-lsp'
      };
      this.diagnostics.push(diagnostic);
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
      }
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

// Make the text document manager listen on the connection
documents.listen(connection);

// Listen on the connection
connection.listen();