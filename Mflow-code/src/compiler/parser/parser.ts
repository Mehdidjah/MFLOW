import { Token, TokenType } from '../lexer/tokens';
import * as AST from '../ast/nodes';

export class ParseError extends Error {
  constructor(
    message: string,
    public line: number,
    public column: number
  ) {
    super(`Parse error at line ${line}, column ${column}: ${message}`);
  }
}

export class Parser {
  private tokens: Token[];
  private current: number = 0;

  constructor(tokens: Token[]) {
    this.tokens = tokens;
  }

  private peek(): Token {
    return this.tokens[this.current];
  }

  private previous(): Token {
    return this.tokens[this.current - 1];
  }

  private isAtEnd(): boolean {
    return this.peek().type === TokenType.EOF;
  }

  private advance(): Token {
    if (!this.isAtEnd()) {
      this.current++;
    }
    return this.previous();
  }

  private check(type: TokenType): boolean {
    if (this.isAtEnd()) return false;
    return this.peek().type === type;
  }

  private match(...types: TokenType[]): boolean {
    for (const type of types) {
      if (this.check(type)) {
        this.advance();
        return true;
      }
    }
    return false;
  }

  private consume(type: TokenType, message: string): Token {
    if (this.check(type)) return this.advance();
    
    const token = this.peek();
    throw new ParseError(message, token.line, token.column);
  }

  public parse(): AST.Program {
    const statements: AST.Statement[] = [];

    while (!this.isAtEnd()) {
      try {
        const stmt = this.statement();
        if (stmt) statements.push(stmt);
      } catch (error) {
        if (error instanceof ParseError) {
          console.error(error.message);
          this.synchronize();
        } else {
          throw error;
        }
      }
    }

    return {
      type: AST.NodeType.PROGRAM,
      body: statements,
      line: 1,
      column: 1,
    };
  }

  private synchronize(): void {
    this.advance();

    while (!this.isAtEnd()) {
      if (this.previous().type === TokenType.NEWLINE) return;

      switch (this.peek().type) {
        case TokenType.LET:
        case TokenType.FN:
        case TokenType.IF:
        case TokenType.REPEAT:
        case TokenType.WHILE:
        case TokenType.FOR:
        case TokenType.ANIMATE:
        case TokenType.SCENE:
        case TokenType.RETURN:
          return;
      }

      this.advance();
    }
  }

  private statement(): AST.Statement | null {
    if (this.match(TokenType.LET)) return this.letStatement();
    if (this.match(TokenType.FN)) return this.functionDeclaration();
    if (this.match(TokenType.RETURN)) return this.returnStatement();
    if (this.match(TokenType.IF)) return this.ifStatement();
    if (this.match(TokenType.REPEAT)) return this.repeatStatement();
    if (this.match(TokenType.WHILE)) return this.whileStatement();
    if (this.match(TokenType.FOR)) return this.forStatement();
    if (this.match(TokenType.ANIMATE)) return this.animateBlock();
    if (this.match(TokenType.SCENE)) return this.sceneBlock();
    
    return this.expressionStatement();
  }

  private letStatement(): AST.LetStatement {
    const token = this.previous();
    const name = this.consume(TokenType.IDENTIFIER, 'Expected variable name');
    this.consume(TokenType.ASSIGN, 'Expected = after variable name');
    const value = this.expression();

    return {
      type: AST.NodeType.LET_STATEMENT,
      identifier: {
        type: AST.NodeType.IDENTIFIER,
        name: name.value,
        line: name.line,
        column: name.column,
      },
      value,
      line: token.line,
      column: token.column,
    };
  }

  private functionDeclaration(): AST.FunctionDeclaration {
    const token = this.previous();
    const name = this.consume(TokenType.IDENTIFIER, 'Expected function name');
    
    this.consume(TokenType.LPAREN, 'Expected ( after function name');
    
    const parameters: AST.Identifier[] = [];
    if (!this.check(TokenType.RPAREN)) {
      do {
        const param = this.consume(TokenType.IDENTIFIER, 'Expected parameter name');
        parameters.push({
          type: AST.NodeType.IDENTIFIER,
          name: param.value,
          line: param.line,
          column: param.column,
        });
      } while (this.match(TokenType.COMMA));
    }
    
    this.consume(TokenType.RPAREN, 'Expected ) after parameters');
    this.consume(TokenType.LBRACE, 'Expected { before function body');
    
    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after function body');

    return {
      type: AST.NodeType.FUNCTION_DECLARATION,
      name: {
        type: AST.NodeType.IDENTIFIER,
        name: name.value,
        line: name.line,
        column: name.column,
      },
      parameters,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private returnStatement(): AST.ReturnStatement {
    const token = this.previous();
    let value: AST.Expression | null = null;
    
    if (!this.isAtEnd() && this.peek().type !== TokenType.RBRACE) {
      value = this.expression();
    }

    return {
      type: AST.NodeType.RETURN_STATEMENT,
      value,
      line: token.line,
      column: token.column,
    };
  }

  private ifStatement(): AST.IfStatement {
    const token = this.previous();
    const condition = this.expression();
    
    this.consume(TokenType.LBRACE, 'Expected { after if condition');
    
    const thenBranch: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) thenBranch.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after if body');
    
    let elseBranch: AST.Statement[] | null = null;
    if (this.match(TokenType.ELSE)) {
      this.consume(TokenType.LBRACE, 'Expected { after else');
      
      elseBranch = [];
      while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
        const stmt = this.statement();
        if (stmt) elseBranch.push(stmt);
      }
      
      this.consume(TokenType.RBRACE, 'Expected } after else body');
    }

    return {
      type: AST.NodeType.IF_STATEMENT,
      condition,
      thenBranch,
      elseBranch,
      line: token.line,
      column: token.column,
    };
  }

  private repeatStatement(): AST.RepeatStatement {
    const token = this.previous();
    const times = this.expression();
    
    this.consume(TokenType.LBRACE, 'Expected { after repeat count');
    
    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after repeat body');

    return {
      type: AST.NodeType.REPEAT_STATEMENT,
      times,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private whileStatement(): AST.WhileStatement {
    const token = this.previous();
    const condition = this.expression();
    
    this.consume(TokenType.LBRACE, 'Expected { after while condition');
    
    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after while body');

    return {
      type: AST.NodeType.WHILE_STATEMENT,
      condition,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private forStatement(): AST.ForStatement {
    const token = this.previous();
    
    // Parse init (optional let statement)
    let init: AST.Statement | null = null;
    if (this.match(TokenType.LET)) {
      init = this.letStatement();
    }
    
    // Parse condition
    const condition = this.expression();
    
    // Parse update (optional expression)
    let update: AST.Expression | null = null;
    if (!this.check(TokenType.LBRACE)) {
      update = this.expression();
    }
    
    this.consume(TokenType.LBRACE, 'Expected { after for');
    
    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after for body');

    return {
      type: AST.NodeType.FOR_STATEMENT,
      init,
      condition,
      update,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private animateBlock(): AST.AnimateBlock {
    const token = this.previous();
    this.consume(TokenType.LBRACE, 'Expected { after animate');
    
    const animations: AST.AnimationCommand[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      if (this.match(TokenType.MOVE)) {
        animations.push(this.moveCommand());
      } else if (this.match(TokenType.ROTATE)) {
        animations.push(this.rotateCommand());
      } else if (this.match(TokenType.SCALE)) {
        animations.push(this.scaleCommand());
      } else if (this.match(TokenType.FADE)) {
        animations.push(this.fadeCommand());
      } else if (this.match(TokenType.BOUNCE)) {
        animations.push(this.bounceCommand());
      } else if (this.match(TokenType.WAVE)) {
        animations.push(this.waveCommand());
      } else if (this.match(TokenType.ORBIT)) {
        animations.push(this.orbitCommand());
      } else if (this.match(TokenType.PULSE)) {
        animations.push(this.pulseCommand());
      } else if (this.match(TokenType.WOBBLE)) {
        animations.push(this.wobbleCommand());
      } else if (this.match(TokenType.SPRING)) {
        animations.push(this.springCommand());
      } else {
        this.advance();
      }
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after animate block');

    return {
      type: AST.NodeType.ANIMATE_BLOCK,
      animations,
      line: token.line,
      column: token.column,
    };
  }

  private sceneBlock(): AST.SceneBlock {
    const token = this.previous();
    const name = this.consume(TokenType.IDENTIFIER, 'Expected scene name');
    
    this.consume(TokenType.LBRACE, 'Expected { after scene name');
    
    const body: AST.Statement[] = [];
    while (!this.check(TokenType.RBRACE) && !this.isAtEnd()) {
      const stmt = this.statement();
      if (stmt) body.push(stmt);
    }
    
    this.consume(TokenType.RBRACE, 'Expected } after scene body');

    return {
      type: AST.NodeType.SCENE_BLOCK,
      name: name.value,
      body,
      line: token.line,
      column: token.column,
    };
  }

  private moveCommand(): AST.Move {
    const token = this.previous();
    const amount = this.primary();
    
    let direction: 'up' | 'down' | 'left' | 'right' = 'right';
    if (this.match(TokenType.UP, TokenType.DOWN, TokenType.LEFT, TokenType.RIGHT)) {
      direction = this.previous().value.toLowerCase() as any;
    }

    return {
      type: AST.NodeType.MOVE,
      amount,
      direction,
      line: token.line,
      column: token.column,
    };
  }

  private rotateCommand(): AST.Rotate {
    const token = this.previous();
    const angle = this.primary();

    return {
      type: AST.NodeType.ROTATE,
      angle,
      line: token.line,
      column: token.column,
    };
  }

  private scaleCommand(): AST.Scale {
    const token = this.previous();
    const factor = this.primary();

    return {
      type: AST.NodeType.SCALE,
      factor,
      line: token.line,
      column: token.column,
    };
  }

  private fadeCommand(): AST.Fade {
    const token = this.previous();
    const amount = this.primary();

    return {
      type: AST.NodeType.FADE,
      amount,
      line: token.line,
      column: token.column,
    };
  }

  private bounceCommand(): AST.Bounce {
    const token = this.previous();
    const damping = this.check(TokenType.NUMBER) ? this.primary() : undefined;

    return {
      type: AST.NodeType.BOUNCE,
      damping,
      line: token.line,
      column: token.column,
    };
  }

  private waveCommand(): AST.Wave {
    const token = this.previous();
    const amplitude = this.primary();
    const frequency = this.primary();

    return {
      type: AST.NodeType.WAVE,
      amplitude,
      frequency,
      line: token.line,
      column: token.column,
    };
  }

  private orbitCommand(): AST.Orbit {
    const token = this.previous();
    const centerX = this.primary();
    const centerY = this.primary();
    const radius = this.primary();
    const speed = this.primary();

    return {
      type: AST.NodeType.ORBIT,
      centerX,
      centerY,
      radius,
      speed,
      line: token.line,
      column: token.column,
    };
  }

  private pulseCommand(): AST.Pulse {
    const token = this.previous();
    const minScale = this.primary();
    const maxScale = this.primary();
    const speed = this.check(TokenType.NUMBER) || this.check(TokenType.IDENTIFIER) ? this.primary() : undefined;

    return {
      type: AST.NodeType.PULSE,
      minScale,
      maxScale,
      speed,
      line: token.line,
      column: token.column,
    };
  }

  private wobbleCommand(): AST.Wobble {
    const token = this.previous();
    const amount = this.primary();
    const speed = this.check(TokenType.NUMBER) || this.check(TokenType.IDENTIFIER) ? this.primary() : undefined;

    return {
      type: AST.NodeType.WOBBLE,
      amount,
      speed,
      line: token.line,
      column: token.column,
    };
  }

  private springCommand(): AST.Spring {
    const token = this.previous();
    const targetX = this.primary();
    const targetY = this.primary();
    const stiffness = this.check(TokenType.NUMBER) || this.check(TokenType.IDENTIFIER) ? this.primary() : undefined;
    const damping = this.check(TokenType.NUMBER) || this.check(TokenType.IDENTIFIER) ? this.primary() : undefined;

    return {
      type: AST.NodeType.SPRING,
      targetX,
      targetY,
      stiffness,
      damping,
      line: token.line,
      column: token.column,
    };
  }

  private expressionStatement(): AST.ExpressionStatement {
    const expr = this.expression();
    
    return {
      type: AST.NodeType.EXPRESSION_STATEMENT,
      expression: expr,
      line: expr.line,
      column: expr.column,
    };
  }

  private expression(): AST.Expression {
    return this.comparison();
  }

  private comparison(): AST.Expression {
    let expr = this.additive();

    while (this.match(TokenType.GREATER_THAN, TokenType.GREATER_EQUAL, 
                       TokenType.LESS_THAN, TokenType.LESS_EQUAL,
                       TokenType.EQUAL, TokenType.NOT_EQUAL)) {
      const operator = this.previous();
      const right = this.additive();
      expr = {
        type: AST.NodeType.BINARY_EXPRESSION,
        operator: operator.value,
        left: expr,
        right,
        line: operator.line,
        column: operator.column,
      };
    }

    return expr;
  }

  private additive(): AST.Expression {
    let expr = this.multiplicative();

    while (this.match(TokenType.PLUS, TokenType.MINUS)) {
      const operator = this.previous();
      const right = this.multiplicative();
      expr = {
        type: AST.NodeType.BINARY_EXPRESSION,
        operator: operator.value,
        left: expr,
        right,
        line: operator.line,
        column: operator.column,
      };
    }

    return expr;
  }

  private multiplicative(): AST.Expression {
    let expr = this.call();

    while (this.match(TokenType.MULTIPLY, TokenType.DIVIDE, TokenType.MODULO)) {
      const operator = this.previous();
      const right = this.call();
      expr = {
        type: AST.NodeType.BINARY_EXPRESSION,
        operator: operator.value,
        left: expr,
        right,
        line: operator.line,
        column: operator.column,
      };
    }

    return expr;
  }

  private call(): AST.Expression {
    let expr = this.shape();

    while (true) {
      if (this.match(TokenType.LPAREN)) {
        const args: AST.Expression[] = [];
        
        if (!this.check(TokenType.RPAREN)) {
          do {
            args.push(this.expression());
          } while (this.match(TokenType.COMMA));
        }
        
        this.consume(TokenType.RPAREN, 'Expected ) after arguments');
        
        expr = {
          type: AST.NodeType.CALL_EXPRESSION,
          callee: expr,
          arguments: args,
          line: expr.line,
          column: expr.column,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private shape(): AST.Expression {
    if (this.match(TokenType.CIRCLE)) return this.circle();
    if (this.match(TokenType.RECT)) return this.rect();
    if (this.match(TokenType.LINE)) return this.line();
    if (this.match(TokenType.TRIANGLE)) return this.triangle();
    if (this.match(TokenType.POLYGON)) return this.polygon();
    if (this.match(TokenType.ELLIPSE)) return this.ellipse();
    if (this.match(TokenType.ARC)) return this.arc();
    if (this.match(TokenType.TEXT)) return this.text();
    
    return this.member();
  }

  private member(): AST.Expression {
    let expr = this.primary();

    while (true) {
      if (this.match(TokenType.DOT)) {
        const property = this.consume(TokenType.IDENTIFIER, 'Expected property name after .');
        expr = {
          type: AST.NodeType.MEMBER_EXPRESSION,
          object: expr,
          property: {
            type: AST.NodeType.IDENTIFIER,
            name: property.value,
            line: property.line,
            column: property.column,
          },
          line: expr.line,
          column: expr.column,
        };
      } else if (this.match(TokenType.LBRACKET)) {
        const index = this.expression();
        this.consume(TokenType.RBRACKET, 'Expected ] after index');
        expr = {
          type: AST.NodeType.INDEX_EXPRESSION,
          object: expr,
          index,
          line: expr.line,
          column: expr.column,
        };
      } else {
        break;
      }
    }

    return expr;
  }

  private circle(): AST.Circle {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after circle');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    this.consume(TokenType.SIZE, 'Expected "size" keyword');
    const size = this.expression();
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    return {
      type: AST.NodeType.CIRCLE,
      position: { x, y },
      size,
      color,
      line: token.line,
      column: token.column,
    };
  }

  private rect(): AST.Rect {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after rect');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    this.consume(TokenType.WIDTH, 'Expected "width" keyword');
    const width = this.expression();
    
    this.consume(TokenType.HEIGHT, 'Expected "height" keyword');
    const height = this.expression();
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    return {
      type: AST.NodeType.RECT,
      position: { x, y },
      width,
      height,
      color,
      line: token.line,
      column: token.column,
    };
  }

  private line(): AST.Line {
    const token = this.previous();
    
    this.consume(TokenType.LPAREN, 'Expected ( for start position');
    const x1 = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y1 = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after start position');
    
    this.consume(TokenType.LPAREN, 'Expected ( for end position');
    const x2 = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y2 = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after end position');
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    return {
      type: AST.NodeType.LINE,
      start: { x: x1, y: y1 },
      end: { x: x2, y: y2 },
      color,
      line: token.line,
      column: token.column,
    };
  }

  private triangle(): AST.Triangle {
    const token = this.previous();
    const points: Array<{ x: AST.Expression; y: AST.Expression }> = [];
    
    for (let i = 0; i < 3; i++) {
      this.consume(TokenType.LPAREN, 'Expected ( for point');
      const x = this.expression();
      this.consume(TokenType.COMMA, 'Expected , in point');
      const y = this.expression();
      this.consume(TokenType.RPAREN, 'Expected ) after point');
      points.push({ x, y });
    }
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    return {
      type: AST.NodeType.TRIANGLE,
      points,
      color,
      line: token.line,
      column: token.column,
    };
  }

  private polygon(): AST.Polygon {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after polygon');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    this.consume(TokenType.SIDES, 'Expected "sides" keyword');
    const sides = this.expression();
    
    this.consume(TokenType.RADIUS, 'Expected "radius" keyword');
    const radius = this.expression();
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    let rotation: AST.Expression | undefined;
    if (this.match(TokenType.ROTATE)) {
      rotation = this.expression();
    }

    return {
      type: AST.NodeType.POLYGON,
      position: { x, y },
      sides,
      radius,
      color,
      rotation,
      line: token.line,
      column: token.column,
    };
  }

  private ellipse(): AST.Ellipse {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after ellipse');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    // Ellipse syntax: ellipse at (x, y) radiusX rx radiusY ry color c
    // For simplicity, just parse two expressions (radiusX and radiusY)
    const radiusX = this.expression();
    const radiusY = this.expression();
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    let rotation: AST.Expression | undefined;
    if (this.match(TokenType.ROTATE)) {
      rotation = this.expression();
    }

    return {
      type: AST.NodeType.ELLIPSE,
      position: { x, y },
      radiusX,
      radiusY,
      color,
      rotation,
      line: token.line,
      column: token.column,
    };
  }

  private arc(): AST.Arc {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after arc');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    this.consume(TokenType.RADIUS, 'Expected "radius" keyword');
    const radius = this.expression();
    
    this.consume(TokenType.START_ANGLE, 'Expected "startAngle" keyword');
    const startAngle = this.expression();
    
    this.consume(TokenType.END_ANGLE, 'Expected "endAngle" keyword');
    const endAngle = this.expression();
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    return {
      type: AST.NodeType.ARC,
      position: { x, y },
      radius,
      startAngle,
      endAngle,
      color,
      counterclockwise: false,
      line: token.line,
      column: token.column,
    };
  }

  private text(): AST.Text {
    const token = this.previous();
    
    this.consume(TokenType.AT, 'Expected "at" after text');
    this.consume(TokenType.LPAREN, 'Expected ( for position');
    const x = this.expression();
    this.consume(TokenType.COMMA, 'Expected , in position');
    const y = this.expression();
    this.consume(TokenType.RPAREN, 'Expected ) after position');
    
    // Parse content (can be string or identifier)
    let content: AST.Expression;
    if (this.check(TokenType.STRING) || this.check(TokenType.IDENTIFIER)) {
      content = this.primary();
    } else {
      const contentToken = this.consume(TokenType.IDENTIFIER, 'Expected text content');
      content = {
        type: AST.NodeType.STRING_LITERAL,
        value: contentToken.value,
        line: contentToken.line,
        column: contentToken.column,
      };
    }
    
    this.consume(TokenType.COLOR_PROP, 'Expected "color" keyword');
    const color = this.expression();

    let font: AST.Expression | undefined;
    let size: AST.Expression | undefined;
    let align: 'left' | 'center' | 'right' | undefined;

    if (this.match(TokenType.FONT)) {
      const fontExpr = this.expression();
      if (fontExpr.type === AST.NodeType.STRING_LITERAL) {
        font = fontExpr;
      }
    }

    if (this.match(TokenType.SIZE)) {
      size = this.expression();
    }

    return {
      type: AST.NodeType.TEXT,
      position: { x, y },
      content,
      color,
      font,
      size,
      align,
      line: token.line,
      column: token.column,
    };
  }

  private primary(): AST.Expression {
    if (this.match(TokenType.NUMBER)) {
      const token = this.previous();
      return {
        type: AST.NodeType.NUMBER_LITERAL,
        value: parseFloat(token.value),
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.STRING)) {
      const token = this.previous();
      return {
        type: AST.NodeType.STRING_LITERAL,
        value: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.COLOR)) {
      const token = this.previous();
      return {
        type: AST.NodeType.COLOR_LITERAL,
        value: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.TRUE)) {
      const token = this.previous();
      return {
        type: AST.NodeType.BOOLEAN_LITERAL,
        value: true,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.FALSE)) {
      const token = this.previous();
      return {
        type: AST.NodeType.BOOLEAN_LITERAL,
        value: false,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.NULL)) {
      const token = this.previous();
      return {
        type: AST.NodeType.NULL_LITERAL,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.LBRACKET)) {
      return this.arrayLiteral();
    }

    if (this.match(TokenType.LBRACE)) {
      return this.objectLiteral();
    }

    if (this.match(TokenType.IDENTIFIER)) {
      const token = this.previous();
      return {
        type: AST.NodeType.IDENTIFIER,
        name: token.value,
        line: token.line,
        column: token.column,
      };
    }

    if (this.match(TokenType.LPAREN)) {
      const expr = this.expression();
      this.consume(TokenType.RPAREN, 'Expected ) after expression');
      return expr;
    }

    const token = this.peek();
    throw new ParseError(`Unexpected token: ${token.value}`, token.line, token.column);
  }

  private arrayLiteral(): AST.ArrayLiteral {
    const token = this.previous();
    const elements: AST.Expression[] = [];

    if (!this.check(TokenType.RBRACKET)) {
      do {
        elements.push(this.expression());
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RBRACKET, 'Expected ] after array elements');

    return {
      type: AST.NodeType.ARRAY_LITERAL,
      elements,
      line: token.line,
      column: token.column,
    };
  }

  private objectLiteral(): AST.ObjectLiteral {
    const token = this.previous();
    const properties: Array<{ key: string; value: AST.Expression }> = [];

    if (!this.check(TokenType.RBRACE)) {
      do {
        const key = this.consume(TokenType.IDENTIFIER, 'Expected property name');
        this.consume(TokenType.COLON, 'Expected : after property name');
        const value = this.expression();
        properties.push({ key: key.value, value });
      } while (this.match(TokenType.COMMA));
    }

    this.consume(TokenType.RBRACE, 'Expected } after object properties');

    return {
      type: AST.NodeType.OBJECT_LITERAL,
      properties,
      line: token.line,
      column: token.column,
    };
  }
}
