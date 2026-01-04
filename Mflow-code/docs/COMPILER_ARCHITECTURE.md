# MFlow Compiler Architecture

**Design and Implementation Guide - by Mehdi**

## Overview

The MFlow compiler is a complete implementation of a domain-specific language compiler, featuring all standard compiler phases from lexical analysis through code generation. Built with TypeScript, the compiler emphasizes clean architecture, maintainability, and extensibility.

## Architecture Diagram

```
Source Code (.mflow)
         ↓
    ┌─────────┐
    │  Lexer  │  ← Tokenization
    └────┬────┘
         ↓
    [Token Stream]
         ↓
    ┌─────────┐
    │ Parser  │  ← AST Construction
    └────┬────┘
         ↓
    [Abstract Syntax Tree]
         ↓
    ┌───────────────┐
    │    Semantic   │  ← Validation
    │    Analyzer   │
    └───────┬───────┘
         ↓
    [Validated AST]
         ↓
    ┌───────────────┐
    │     Code      │  ← JavaScript Generation
    │   Generator   │
    └───────┬───────┘
         ↓
    JavaScript Output
```

## Phase 1: Lexical Analysis (Lexer)

### Purpose
Convert raw source code into a stream of tokens that represent the basic building blocks of the language.

### Implementation
**File**: `src/compiler/lexer/lexer.ts`

The lexer uses a character-by-character scanning approach:

```typescript
export class Lexer {
  private input: string;
  private position: number;
  private line: number;
  private column: number;
  private currentChar: string | null;

  public tokenize(): Token[] {
    // Scan through input and generate tokens
  }
}
```

### Key Features

1. **Whitespace Handling**: Automatically skips spaces and tabs
2. **Comment Support**: Recognizes `//` single-line comments
3. **Number Parsing**: Handles integers and floating-point numbers
4. **String Parsing**: Quote-delimited strings with escape sequences
5. **Color Recognition**: Hex color codes (`#RRGGBB`)
6. **Keyword Detection**: Efficient lookup table for reserved words

### Token Types

Defined in `src/compiler/lexer/tokens.ts`:

- **Literals**: `NUMBER`, `STRING`, `COLOR`, `IDENTIFIER`
- **Keywords**: `LET`, `FN`, `CIRCLE`, `ANIMATE`, etc.
- **Operators**: `PLUS`, `MINUS`, `MULTIPLY`, `ASSIGN`, etc.
- **Delimiters**: `LPAREN`, `RPAREN`, `LBRACE`, `RBRACE`

### Example

Input:
```mflow
let x = 100
circle at (x, 200) size 50 color #FF00FF
```

Token Stream:
```
LET, IDENTIFIER("x"), ASSIGN, NUMBER(100),
CIRCLE, AT, LPAREN, IDENTIFIER("x"), COMMA, NUMBER(200), RPAREN,
SIZE, NUMBER(50), COLOR_PROP, COLOR("#FF00FF")
```

## Phase 2: Syntax Analysis (Parser)

### Purpose
Build an Abstract Syntax Tree (AST) that represents the hierarchical structure of the program.

### Implementation
**File**: `src/compiler/parser/parser.ts`

The parser uses **recursive descent** parsing:

```typescript
export class Parser {
  private tokens: Token[];
  private current: number;

  public parse(): AST.Program {
    // Build AST from token stream
  }
}
```

### Parsing Strategy

1. **Top-Down**: Start from program root, recurse into details
2. **LL(1)**: One token lookahead for decision making
3. **Operator Precedence**: Handle arithmetic and comparison correctly
4. **Error Recovery**: Synchronize on statement boundaries

### Grammar Structure

```
Program        → Statement*
Statement      → LetStmt | FnDecl | IfStmt | RepeatStmt | AnimateBlock | SceneBlock | ExprStmt
LetStmt        → "let" IDENTIFIER "=" Expression
FnDecl         → "fn" IDENTIFIER "(" Parameters? ")" "{" Statement* "}"
IfStmt         → "if" Expression "{" Statement* "}" ("else" "{" Statement* "}")?
Expression     → Comparison
Comparison     → Additive ((">" | "<" | "==" | "!=") Additive)*
Additive       → Multiplicative (("+" | "-") Multiplicative)*
Multiplicative → Primary (("*" | "/" | "%") Primary)*
Primary        → NUMBER | STRING | COLOR | IDENTIFIER | Shape | "(" Expression ")"
Shape          → Circle | Rect | Line | Triangle
```

### AST Node Types

Defined in `src/compiler/ast/nodes.ts`:

- **Program**: Root node containing all statements
- **Statements**: `LetStatement`, `FunctionDeclaration`, `IfStatement`, etc.
- **Expressions**: `BinaryExpression`, `CallExpression`, `Literal`, `Shape`
- **Shapes**: `Circle`, `Rect`, `Line`, `Triangle`
- **Animation**: `Move`, `Rotate`, `Scale`, `Fade`

### Example

Source:
```mflow
let x = 10 + 5
```

AST:
```
Program
  └─ LetStatement
      ├─ identifier: "x"
      └─ value: BinaryExpression
          ├─ operator: "+"
          ├─ left: NumberLiteral(10)
          └─ right: NumberLiteral(5)
```

## Phase 3: Semantic Analysis

### Purpose
Validate the AST for semantic correctness: proper scoping, variable declaration, and type consistency.

### Implementation
**File**: `src/compiler/semantic/analyzer.ts`

The analyzer uses a symbol table stack for scope management:

```typescript
export class SemanticAnalyzer {
  private scopes: SymbolTable[];
  private errors: SemanticError[];

  public analyze(program: AST.Program): SemanticError[] {
    // Validate AST and collect errors
  }
}
```

### Checks Performed

1. **Variable Declaration**: Ensure variables are declared before use
2. **Scope Management**: Track nested scopes (functions, scenes)
3. **Duplicate Detection**: Prevent redeclaration in same scope
4. **Function Validation**: Check parameter counts match calls
5. **Type Consistency**: Basic type checking for operations

### Symbol Table

```typescript
interface SymbolTable {
  [name: string]: {
    type: string;      // "variable" | "function" | "parameter"
    line: number;
    column: number;
  };
}
```

### Example Error

Source:
```mflow
let x = y + 5  // Error: 'y' is not defined
```

Error:
```
Semantic error at line 1, column 9: Undefined variable 'y'
```

## Phase 4: Code Generation

### Purpose
Generate executable JavaScript code from the validated AST.

### Implementation
**File**: `src/compiler/codegen/generator.ts`

The generator traverses the AST and emits JavaScript:

```typescript
export class CodeGenerator {
  private output: string;
  private indent: number;

  public generate(program: AST.Program): string {
    // Convert AST to JavaScript
  }
}
```

### Generation Strategy

1. **Runtime Setup**: Canvas initialization and helper functions
2. **Statement Generation**: Convert AST statements to JS
3. **Expression Generation**: Handle operators and function calls
4. **Shape Rendering**: Emit Canvas API calls
5. **Animation Loops**: Create `requestAnimationFrame` structures

### Generated Code Structure

```javascript
// Runtime setup
const canvas = document.getElementById("mflow-canvas");
const ctx = canvas.getContext("2d");

// Animation state
let animationState = { x: 0, y: 0, rotation: 0, scale: 1, opacity: 1 };

// Helper functions
function applyTransform(x, y) { /* ... */ }
function clear() { /* ... */ }

// User code
(function main() {
  // Generated from AST
})();
```

### Example

MFlow:
```mflow
circle at (250, 250) size 50 color #00FFFF
```

JavaScript:
```javascript
(function() {
  ctx.save();
  const x = 250;
  const y = 250;
  const size = 50;
  const color = "#00FFFF";
  applyTransform(x, y);
  ctx.beginPath();
  ctx.arc(0, 0, size, 0, Math.PI * 2);
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
})();
```

## Complete Compilation Pipeline

### Usage

```typescript
import { MFlowCompiler } from './compiler';

const compiler = new MFlowCompiler();
const result = compiler.compile(sourceCode);

if (result.success) {
  // Execute or save result.output
} else {
  // Display result.errors
}
```

### Error Handling

Errors can occur at any phase:

1. **Lexical errors**: Invalid tokens
2. **Syntax errors**: Malformed statements
3. **Semantic errors**: Undefined variables
4. **Generation errors**: (Rare) Internal compiler errors

All errors include:
- Line number
- Column number
- Descriptive message

## Performance Considerations

1. **Single-Pass Lexing**: Efficient character scanning
2. **Predictive Parsing**: Minimal backtracking
3. **Lazy Generation**: Only generate code if analysis succeeds
4. **String Building**: Efficient string concatenation for output

## Extensibility

The compiler is designed for easy extension:

### Adding New Keywords

1. Add to `TokenType` enum in `tokens.ts`
2. Add to `KEYWORDS` map in `tokens.ts`
3. Update parser to handle new syntax

### Adding New AST Nodes

1. Define node type in `ast/nodes.ts`
2. Update parser to construct new nodes
3. Add semantic validation if needed
4. Implement code generation

### Adding New Optimizations

Create optimization passes between phases:
- Constant folding
- Dead code elimination
- Common subexpression elimination

## Testing Strategy

1. **Unit Tests**: Test each phase independently
2. **Integration Tests**: Test full compilation pipeline
3. **Error Tests**: Verify error handling and recovery
4. **Example Tests**: Compile and validate example programs

## Future Enhancements

Potential improvements:

- **Type Inference**: More sophisticated type system
- **Optimization Pass**: Improve generated code efficiency
- **Source Maps**: Map generated JS back to MFlow source
- **Multiple Targets**: Compile to WebGL, SVG, or other backends
- **IDE Support**: Language server protocol implementation

---

**MFlow Compiler Architecture**  
*Professional compiler design for creative coding*  
*Created by Mehdi*
