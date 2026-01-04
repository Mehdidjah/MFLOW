import * as AST from '../ast/nodes';

export class SemanticError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number
  ) {
    super(`Semantic error at line ${line}, column ${column}: ${message}`);
  }
}

interface SymbolTable {
  [key: string]: { type: string; line: number; column: number };
}

export class SemanticAnalyzer {
  private scopes: SymbolTable[] = [];
  private errors: SemanticError[] = [];

  constructor() {
    this.enterScope(); // Global scope
  }

  private enterScope(): void {
    this.scopes.push({});
  }

  private exitScope(): void {
    this.scopes.pop();
  }

  private currentScope(): SymbolTable {
    return this.scopes[this.scopes.length - 1];
  }

  private declare(name: string, type: string, line: number, column: number): void {
    const scope = this.currentScope();
    
    if (scope[name]) {
      this.errors.push(
        new SemanticError(
          `Variable '${name}' is already declared in this scope`,
          line,
          column
        )
      );
    } else {
      scope[name] = { type, line, column };
    }
  }

  private resolve(name: string, line: number, column: number): { type: string } | null {
    for (let i = this.scopes.length - 1; i >= 0; i--) {
      if (this.scopes[i][name]) {
        return this.scopes[i][name];
      }
    }
    
    this.errors.push(
      new SemanticError(`Undefined variable '${name}'`, line, column)
    );
    return null;
  }

  public analyze(program: AST.Program): SemanticError[] {
    this.errors = [];
    
    for (const statement of program.body) {
      this.analyzeStatement(statement);
    }
    
    return this.errors;
  }

  private analyzeStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case AST.NodeType.LET_STATEMENT:
        this.analyzeLetStatement(stmt);
        break;
      case AST.NodeType.FUNCTION_DECLARATION:
        this.analyzeFunctionDeclaration(stmt);
        break;
      case AST.NodeType.RETURN_STATEMENT:
        if (stmt.value) {
          this.analyzeExpression(stmt.value);
        }
        break;
      case AST.NodeType.IF_STATEMENT:
        this.analyzeExpression(stmt.condition);
        for (const thenStmt of stmt.thenBranch) {
          this.analyzeStatement(thenStmt);
        }
        if (stmt.elseBranch) {
          for (const elseStmt of stmt.elseBranch) {
            this.analyzeStatement(elseStmt);
          }
        }
        break;
      case AST.NodeType.REPEAT_STATEMENT:
        this.analyzeExpression(stmt.times);
        for (const bodyStmt of stmt.body) {
          this.analyzeStatement(bodyStmt);
        }
        break;
      case AST.NodeType.WHILE_STATEMENT:
        this.analyzeExpression(stmt.condition);
        for (const bodyStmt of stmt.body) {
          this.analyzeStatement(bodyStmt);
        }
        break;
      case AST.NodeType.FOR_STATEMENT:
        if (stmt.init) {
          this.analyzeStatement(stmt.init);
        }
        this.analyzeExpression(stmt.condition);
        if (stmt.update) {
          this.analyzeExpression(stmt.update);
        }
        for (const bodyStmt of stmt.body) {
          this.analyzeStatement(bodyStmt);
        }
        break;
      case AST.NodeType.ANIMATE_BLOCK:
        // Animation commands are validated during code generation
        break;
      case AST.NodeType.SCENE_BLOCK:
        this.enterScope();
        for (const bodyStmt of stmt.body) {
          this.analyzeStatement(bodyStmt);
        }
        this.exitScope();
        break;
      case AST.NodeType.IMPORT_STATEMENT:
        // Imports are handled at compile time
        break;
      case AST.NodeType.EXPRESSION_STATEMENT:
        this.analyzeExpression(stmt.expression);
        break;
    }
  }

  private analyzeLetStatement(stmt: AST.LetStatement): void {
    this.analyzeExpression(stmt.value);
    this.declare(
      stmt.identifier.name,
      'variable',
      stmt.identifier.line,
      stmt.identifier.column
    );
  }

  private analyzeFunctionDeclaration(stmt: AST.FunctionDeclaration): void {
    this.declare(
      stmt.name.name,
      'function',
      stmt.name.line,
      stmt.name.column
    );
    
    this.enterScope();
    
    for (const param of stmt.parameters) {
      this.declare(param.name, 'parameter', param.line, param.column);
    }
    
    for (const bodyStmt of stmt.body) {
      this.analyzeStatement(bodyStmt);
    }
    
    this.exitScope();
  }

  private analyzeExpression(expr: AST.Expression): void {
    switch (expr.type) {
      case AST.NodeType.IDENTIFIER:
        this.resolve(expr.name, expr.line, expr.column);
        break;
      case AST.NodeType.BINARY_EXPRESSION:
        this.analyzeExpression(expr.left);
        this.analyzeExpression(expr.right);
        break;
      case AST.NodeType.CALL_EXPRESSION:
        this.analyzeExpression(expr.callee);
        for (const arg of expr.arguments) {
          this.analyzeExpression(arg);
        }
        break;
      case AST.NodeType.CIRCLE:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.size);
        this.analyzeExpression(expr.color);
        break;
      case AST.NodeType.RECT:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.width);
        this.analyzeExpression(expr.height);
        this.analyzeExpression(expr.color);
        break;
      case AST.NodeType.LINE:
        this.analyzeExpression(expr.start.x);
        this.analyzeExpression(expr.start.y);
        this.analyzeExpression(expr.end.x);
        this.analyzeExpression(expr.end.y);
        this.analyzeExpression(expr.color);
        break;
      case AST.NodeType.TRIANGLE:
        for (const point of expr.points) {
          this.analyzeExpression(point.x);
          this.analyzeExpression(point.y);
        }
        this.analyzeExpression(expr.color);
        break;
      case AST.NodeType.POLYGON:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.sides);
        this.analyzeExpression(expr.radius);
        this.analyzeExpression(expr.color);
        if (expr.rotation) {
          this.analyzeExpression(expr.rotation);
        }
        break;
      case AST.NodeType.ELLIPSE:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.radiusX);
        this.analyzeExpression(expr.radiusY);
        this.analyzeExpression(expr.color);
        if (expr.rotation) {
          this.analyzeExpression(expr.rotation);
        }
        break;
      case AST.NodeType.ARC:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.radius);
        this.analyzeExpression(expr.startAngle);
        this.analyzeExpression(expr.endAngle);
        this.analyzeExpression(expr.color);
        break;
      case AST.NodeType.TEXT:
        this.analyzeExpression(expr.position.x);
        this.analyzeExpression(expr.position.y);
        this.analyzeExpression(expr.content);
        this.analyzeExpression(expr.color);
        if (expr.font) {
          this.analyzeExpression(expr.font);
        }
        if (expr.size) {
          this.analyzeExpression(expr.size);
        }
        break;
      case AST.NodeType.MEMBER_EXPRESSION:
        this.analyzeExpression(expr.object);
        break;
      case AST.NodeType.INDEX_EXPRESSION:
        this.analyzeExpression(expr.object);
        this.analyzeExpression(expr.index);
        break;
      case AST.NodeType.ARRAY_LITERAL:
        for (const elem of expr.elements) {
          this.analyzeExpression(elem);
        }
        break;
      case AST.NodeType.OBJECT_LITERAL:
        for (const prop of expr.properties) {
          this.analyzeExpression(prop.value);
        }
        break;
      case AST.NodeType.NUMBER_LITERAL:
      case AST.NodeType.STRING_LITERAL:
      case AST.NodeType.COLOR_LITERAL:
      case AST.NodeType.BOOLEAN_LITERAL:
      case AST.NodeType.NULL_LITERAL:
        // Literals are always valid
        break;
    }
  }
}
