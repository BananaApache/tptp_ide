"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// server.ts – TPTP Language Server
const node_1 = require("vscode-languageserver/node");
const vscode_languageserver_textdocument_1 = require("vscode-languageserver-textdocument");
// Create connection and document manager
const connection = (0, node_1.createConnection)(node_1.ProposedFeatures.all);
const documents = new node_1.TextDocuments(vscode_languageserver_textdocument_1.TextDocument);
let hasConfigurationCapability = false;
let hasWorkspaceFolderCapability = false;
let hasDiagnosticRelatedInformationCapability = false;
connection.onInitialize((params) => {
    const capabilities = params.capabilities;
    hasConfigurationCapability = !!(capabilities.workspace && !!capabilities.workspace.configuration);
    hasWorkspaceFolderCapability = !!(capabilities.workspace && !!capabilities.workspace.workspaceFolders);
    hasDiagnosticRelatedInformationCapability = !!(capabilities.textDocument &&
        capabilities.textDocument.publishDiagnostics &&
        capabilities.textDocument.publishDiagnostics.relatedInformation);
    const result = {
        capabilities: {
            textDocumentSync: node_1.TextDocumentSyncKind.Incremental,
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
        connection.client.register(node_1.DidChangeConfigurationNotification.type, undefined);
    }
    if (hasWorkspaceFolderCapability) {
        connection.workspace.onDidChangeWorkspaceFolders(_event => {
            connection.console.log('Workspace folder change event received.');
        });
    }
});
// TPTP Parser and Validator
class TPTPValidator {
    constructor() {
        this.diagnostics = [];
    }
    validateDocument(textDocument) {
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
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: startLine, character: trimmedOld.length },
                        end: { line: startLine, character: trimmedOld.length }
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
                }
                else {
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
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: startLine, character: trimmedBuffer.length },
                        end: { line: startLine, character: trimmedBuffer.length }
                    },
                    message: 'TPTP formula must end with a period (.)',
                    source: 'tptp-lsp'
                });
            }
            // Then still attempt the remaining structural checks if it did end with “.” but was unbalanced, etc.
            if (this.isFormulaLine(trimmedBuffer)) {
                this.validateFormula(trimmedBuffer, startLine, textDocument);
            }
            else if (this.isIncludeLine(trimmedBuffer)) {
                this.validateInclude(trimmedBuffer, startLine, textDocument);
            }
        }
        return this.diagnostics;
    }
    isFormulaLine(line) {
        return /^(tpi|thf|tff|tcf|fof|cnf)\s*\(/.test(line);
    }
    isIncludeLine(line) {
        return /^include\s*\(/.test(line);
    }
    validateFormula(line, lineNum, document) {
        // 1) Trim trailing whitespace/newlines before checking “endsWith('.')”
        const trimmedLine = line.trimEnd();
        // If it does not end in '.', we already reported above. Now run the rest of the checks on trimmedLine:
        if (!trimmedLine.endsWith(".")) {
            // (This branch is rarely reached here because the “missing-period” was already emitted above,
            //  but we keep it for completeness.)
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: trimmedLine.length },
                    end: { line: lineNum, character: trimmedLine.length }
                },
                message: 'TPTP formula must end with a period (.)',
                source: 'tptp-lsp'
            });
        }
        // 2) Check it starts with a valid TPTP type
        const typeMatch = trimmedLine.match(/^(tpi|thf|tff|tcf|fof|cnf)\s*/);
        if (!typeMatch) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: 0 },
                    end: { line: lineNum, character: trimmedLine.length }
                },
                message: 'TPTP formula must start with thf, tff, fof, or cnf',
                source: 'tptp-lsp'
            });
            return;
        }
        const type = typeMatch[1];
        const afterType = trimmedLine.substring(typeMatch[0].length);
        if (!afterType.startsWith('(')) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: typeMatch[0].length },
                    end: { line: lineNum, character: typeMatch[0].length + 1 }
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
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: parenBalance.position },
                    end: { line: lineNum, character: parenBalance.position + 1 }
                },
                message: parenBalance.message,
                source: 'tptp-lsp'
            });
            return;
        }
        // 4) Check the overall structure “type(name, role, formula).”
        const formulaMatch = trimmedLine.match(/^(tpi|thf|tff|tcf|fof|cnf)\s*\(\s*([^,\s]+)\s*,\s*([^,\s]+)\s*,\s*(.+)\)\s*\.\s*$/);
        if (!formulaMatch) {
            if (trimmedLine.includes(",")) {
                this.diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNum, character: 0 },
                        end: { line: lineNum, character: trimmedLine.length }
                    },
                    message: 'Invalid TPTP formula structure. Expected: type(name, role, formula).',
                    source: 'tptp-lsp'
                });
            }
            else {
                this.diagnostics.push({
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNum, character: 0 },
                        end: { line: lineNum, character: trimmedLine.length }
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
            'axiom', 'hypothesis', 'definition', 'assumption', 'lemma', 'theorem',
            'corollary', 'conjecture', 'negated_conjecture', 'plain', 'type',
            'fi_domain', 'fi_functors', 'fi_predicates', 'unknown'
        ];
        if (!validRoles.includes(role)) {
            const roleStart = trimmedLine.indexOf(role);
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Warning,
                range: {
                    start: { line: lineNum, character: roleStart },
                    end: { line: lineNum, character: roleStart + role.length }
                },
                message: `Unknown TPTP role '${role}'. Valid roles: ${validRoles.join(', ')}`,
                source: 'tptp-lsp'
            });
        }
        // 6) Finally check inside the formula body for unmatched quotes, invalid operator sequences, etc.
        this.validateFormulaContent(formulaBody, lineNum, trimmedLine.indexOf(formulaBody), document);
    }
    validateFormulaContent(formula, lineNum, startChar, document) {
        // Check for unmatched single quotes
        const singleQuotes = (formula.match(/'/g) || []).length;
        if (singleQuotes % 2 !== 0) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: startChar },
                    end: { line: lineNum, character: startChar + formula.length }
                },
                message: 'Unmatched single quote in formula',
                source: 'tptp-lsp'
            });
        }
        // Check for unmatched double quotes
        const doubleQuotes = (formula.match(/"/g) || []).length;
        if (doubleQuotes % 2 !== 0) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: startChar },
                    end: { line: lineNum, character: startChar + formula.length }
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
                    severity: node_1.DiagnosticSeverity.Error,
                    range: {
                        start: { line: lineNum, character: startChar + opIndex },
                        end: { line: lineNum, character: startChar + opIndex + op.length }
                    },
                    message: `Invalid operator sequence: ${op}`,
                    source: 'tptp-lsp'
                });
            });
        }
    }
    validateInclude(line, lineNum, document) {
        if (!line.endsWith('.')) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: line.length },
                    end: { line: lineNum, character: line.length }
                },
                message: 'Include statement must end with a period (.)',
                source: 'tptp-lsp'
            });
        }
        // Check include syntax: include('filename').
        if (!/^include\s*\(\s*'[^']+'\s*\)\s*\.\s*$/.test(line)) {
            this.diagnostics.push({
                severity: node_1.DiagnosticSeverity.Error,
                range: {
                    start: { line: lineNum, character: 0 },
                    end: { line: lineNum, character: line.length }
                },
                message: "Include statement must have format: include('filename').",
                source: 'tptp-lsp'
            });
        }
    }
    checkParenthesesBalance(line) {
        let balance = 0;
        let inSingleQuote = false;
        let inDoubleQuote = false;
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            const prevChar = i > 0 ? line[i - 1] : '';
            // Handle quotes (ignore escaped quotes)
            if (char === "'" && prevChar !== '\\') {
                inSingleQuote = !inSingleQuote;
            }
            else if (char === '"' && prevChar !== '\\') {
                inDoubleQuote = !inDoubleQuote;
            }
            // Skip parentheses inside quotes
            if (inSingleQuote || inDoubleQuote)
                continue;
            if (char === '(') {
                balance++;
            }
            else if (char === ')') {
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
async function validateTextDocument(textDocument) {
    const diagnostics = validator.validateDocument(textDocument);
    connection.sendDiagnostics({ uri: textDocument.uri, diagnostics });
}
// Basic completion support
connection.onCompletion((_textDocumentPosition) => {
    return [
        {
            label: 'fof',
            kind: node_1.CompletionItemKind.Keyword,
            data: 1,
            insertText: 'fof(${1:name}, ${2:axiom}, ${3:formula}).',
            insertTextFormat: 2 // Snippet format
        },
        {
            label: 'thf',
            kind: node_1.CompletionItemKind.Keyword,
            data: 2,
            insertText: 'thf(${1:name}, ${2:axiom}, ${3:formula}).',
            insertTextFormat: 2
        },
        {
            label: 'tff',
            kind: node_1.CompletionItemKind.Keyword,
            data: 3,
            insertText: 'tff(${1:name}, ${2:axiom}, ${3:formula}).',
            insertTextFormat: 2
        },
        {
            label: 'cnf',
            kind: node_1.CompletionItemKind.Keyword,
            data: 4,
            insertText: 'cnf(${1:name}, ${2:axiom}, ${3:clause}).',
            insertTextFormat: 2
        },
        {
            label: 'include',
            kind: node_1.CompletionItemKind.Keyword,
            data: 5,
            insertText: "include('${1:filename}').",
            insertTextFormat: 2
        },
        {
            label: 'tpi',
            kind: node_1.CompletionItemKind.Keyword,
            data: 6,
            insertText: 'tpi(${1:name}, ${2:axiom}, ${3:clause}).',
            insertTextFormat: 2
        },
        {
            label: 'tcf',
            kind: node_1.CompletionItemKind.Keyword,
            data: 7,
            insertText: 'tcf(${1:name}, ${2:axiom}, ${3:clause}).',
            insertTextFormat: 2
        },
    ];
});
connection.onCompletionResolve((item) => {
    const descriptions = {
        1: 'First-order formula declaration',
        2: 'Typed higher-order formula declaration',
        3: 'Typed first-order formula declaration',
        4: 'Clause normal form declaration',
        5: 'Include another TPTP file'
    };
    if (item.data && descriptions[item.data]) {
        item.detail = descriptions[item.data];
    }
    return item;
});
// Make the text document manager listen on the connection
documents.listen(connection);
// Listen on the connection
connection.listen();
//# sourceMappingURL=server.js.map