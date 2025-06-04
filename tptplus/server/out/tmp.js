"use strict";
class TPTPValidator {
    constructor() {
        this.diagnostics = [];
        // … rest of TPTPValidator stays the same …
        //    (including isFormulaLine, isIncludeLine, validateFormula, validateInclude, etc.)
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
            // else keep accumulating until we see “.).” with balanced parentheses
        }
        // 5) If we hit EOF while still “insideFormula,” do one final validation call
        if (insideFormula && buffer.trim() !== "") {
            const trimmedBuffer = buffer.trimEnd();
            if (this.isFormulaLine(trimmedBuffer)) {
                this.validateFormula(trimmedBuffer, startLine, textDocument);
            }
            else if (this.isIncludeLine(trimmedBuffer)) {
                this.validateInclude(trimmedBuffer, startLine, textDocument);
            }
        }
        return this.diagnostics;
    }
}
//# sourceMappingURL=tmp.js.map