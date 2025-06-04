# TPTP Editor

TPTP Editor is a Visual Studio Code extension that provides syntax highlighting for the [TPTP](http://www.tptp.org/) language — used in automated theorem proving and formal logic research.
(Built by Daniel Li and Esteban Morales assisting Dr. Geoff Sutcliffe)

## Features

- Syntax highlighting for `.p` and `.s` files
- Support for:
  - Single-line `%` comments
  - Quoted strings
  - Logical operators and quantifiers
  - `$`-prefixed system constants
  - TPTP directives like `fof`, `cnf`, `thf`, etc.
- Clean and consistent token coloring across themes

## Requirements

No dependencies required — just install and start editing `.p` or `.s` files.

## Extension Settings

This extension does not contribute any custom settings.

## Release Notes

### 0.0.1

Initial release with base syntax support for TPTP problem files.

### 0.0.2

Updated logo and extension image. Changed README.

### 0.0.3

Added Change Log. Removed Known Issues.

### 0.0.4

Implemented Multiline reading. Added file icon.

---

## For TPTP Language

The Thousands of Problems for Theorem Provers (TPTP) format is widely used in logic and automated reasoning. Learn more at [http://www.tptp.org](http://www.tptp.org)

---

## Development Notes

- Grammar implemented via a `tmLanguage.json` file
- Uses TextMate scopes compatible with popular VS Code themes
- Lexer/grammar derived from an existing [ANTLR4 TPTP grammar](http://www.tptp.org/TPTP/SyntaxBNF.html)

---

**Enjoy using TPTP Editor!**
