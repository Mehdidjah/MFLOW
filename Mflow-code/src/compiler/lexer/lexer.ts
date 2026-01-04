import { Token, TokenType, KEYWORDS } from './tokens';

export class Lexer {
  private input: string;
  private position: number = 0;
  private line: number = 1;
  private column: number = 1;
  private currentChar: string | null;

  constructor(input: string) {
    this.input = input;
    this.currentChar = this.input[0] || null;
  }

  private advance(): void {
    this.position++;
    this.column++;
    
    if (this.position >= this.input.length) {
      this.currentChar = null;
    } else {
      this.currentChar = this.input[this.position];
      
      if (this.currentChar === '\n') {
        this.line++;
        this.column = 1;
      }
    }
  }

  private peek(offset: number = 1): string | null {
    const peekPos = this.position + offset;
    if (peekPos >= this.input.length) {
      return null;
    }
    return this.input[peekPos];
  }

  private skipWhitespace(): void {
    while (this.currentChar !== null && /[ \t\r]/.test(this.currentChar)) {
      this.advance();
    }
  }

  private skipComment(): void {
    const isComment = this.currentChar === '/' && this.peek() === '/';
    if (!isComment) return;
    
    // Skip the entire comment line
    while (this.currentChar !== null && this.currentChar !== '\n') {
      this.advance();
    }
  }

  private readNumber(): Token {
    const startColumn = this.column;
    let numStr = '';
    let hasDot = false;

    while (this.currentChar !== null && (/\d/.test(this.currentChar) || this.currentChar === '.')) {
      if (this.currentChar === '.') {
        if (hasDot) break;
        hasDot = true;
      }
      numStr += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.NUMBER,
      value: numStr,
      line: this.line,
      column: startColumn,
    };
  }

  private readString(): Token {
    const startColumn = this.column;
    this.advance(); // skip opening quote
    let str = '';

    while (this.currentChar !== null && this.currentChar !== '"') {
      if (this.currentChar === '\\' && this.peek() === '"') {
        this.advance();
        str += '"';
        this.advance();
      } else {
        str += this.currentChar;
        this.advance();
      }
    }

    if (this.currentChar === '"') {
      this.advance(); // skip closing quote
    }

    return {
      type: TokenType.STRING,
      value: str,
      line: this.line,
      column: startColumn,
    };
  }

  private readColor(): Token {
    const startColumn = this.column;
    let colorStr = '#';
    this.advance(); // skip #

    while (this.currentChar !== null && /[0-9A-Fa-f]/.test(this.currentChar)) {
      colorStr += this.currentChar;
      this.advance();
    }

    return {
      type: TokenType.COLOR,
      value: colorStr,
      line: this.line,
      column: startColumn,
    };
  }

  private readIdentifier(): Token {
    const startColumn = this.column;
    let identifier = '';

    while (this.currentChar !== null && /[a-zA-Z0-9_]/.test(this.currentChar)) {
      identifier += this.currentChar;
      this.advance();
    }

    const tokenType = KEYWORDS[identifier.toLowerCase()] || TokenType.IDENTIFIER;

    return {
      type: tokenType,
      value: identifier,
      line: this.line,
      column: startColumn,
    };
  }

  public nextToken(): Token {
    while (this.currentChar !== null) {
      this.skipWhitespace();

      if (this.currentChar === null) break;

      // Comments
      if (this.currentChar === '/' && this.peek() === '/') {
        this.skipComment();
        continue;
      }

      // Newlines
      if (this.currentChar === '\n') {
        const token: Token = {
          type: TokenType.NEWLINE,
          value: '\n',
          line: this.line,
          column: this.column,
        };
        this.advance();
        return token;
      }

      // Numbers
      if (/\d/.test(this.currentChar)) {
        return this.readNumber();
      }

      // Strings
      if (this.currentChar === '"') {
        return this.readString();
      }

      // Colors
      if (this.currentChar === '#') {
        return this.readColor();
      }

      // Identifiers and keywords
      if (/[a-zA-Z_]/.test(this.currentChar)) {
        return this.readIdentifier();
      }

      // Operators and delimiters
      const startColumn = this.column;
      const char = this.currentChar;

      switch (char) {
        case '+':
          this.advance();
          return { type: TokenType.PLUS, value: '+', line: this.line, column: startColumn };
        case '-':
          this.advance();
          return { type: TokenType.MINUS, value: '-', line: this.line, column: startColumn };
        case '*':
          this.advance();
          return { type: TokenType.MULTIPLY, value: '*', line: this.line, column: startColumn };
        case '/':
          this.advance();
          return { type: TokenType.DIVIDE, value: '/', line: this.line, column: startColumn };
        case '%':
          this.advance();
          return { type: TokenType.MODULO, value: '%', line: this.line, column: startColumn };
        case '=':
          this.advance();
          if (this.currentChar === '=') {
            this.advance();
            return { type: TokenType.EQUAL, value: '==', line: this.line, column: startColumn };
          }
          return { type: TokenType.ASSIGN, value: '=', line: this.line, column: startColumn };
        case '!':
          this.advance();
          if (this.currentChar === '=') {
            this.advance();
            return { type: TokenType.NOT_EQUAL, value: '!=', line: this.line, column: startColumn };
          }
          return { type: TokenType.ILLEGAL, value: '!', line: this.line, column: startColumn };
        case '<':
          this.advance();
          if (this.currentChar === '=') {
            this.advance();
            return { type: TokenType.LESS_EQUAL, value: '<=', line: this.line, column: startColumn };
          }
          return { type: TokenType.LESS_THAN, value: '<', line: this.line, column: startColumn };
        case '>':
          this.advance();
          if (this.currentChar === '=') {
            this.advance();
            return { type: TokenType.GREATER_EQUAL, value: '>=', line: this.line, column: startColumn };
          }
          return { type: TokenType.GREATER_THAN, value: '>', line: this.line, column: startColumn };
        case '(':
          this.advance();
          return { type: TokenType.LPAREN, value: '(', line: this.line, column: startColumn };
        case ')':
          this.advance();
          return { type: TokenType.RPAREN, value: ')', line: this.line, column: startColumn };
        case '{':
          this.advance();
          return { type: TokenType.LBRACE, value: '{', line: this.line, column: startColumn };
        case '}':
          this.advance();
          return { type: TokenType.RBRACE, value: '}', line: this.line, column: startColumn };
        case ',':
          this.advance();
          return { type: TokenType.COMMA, value: ',', line: this.line, column: startColumn };
        case '.':
          this.advance();
          return { type: TokenType.DOT, value: '.', line: this.line, column: startColumn };
        case '[':
          this.advance();
          return { type: TokenType.LBRACKET, value: '[', line: this.line, column: startColumn };
        case ']':
          this.advance();
          return { type: TokenType.RBRACKET, value: ']', line: this.line, column: startColumn };
        case ':':
          this.advance();
          return { type: TokenType.COLON, value: ':', line: this.line, column: startColumn };
        default:
          this.advance();
          return { type: TokenType.ILLEGAL, value: char, line: this.line, column: startColumn };
      }
    }

    return {
      type: TokenType.EOF,
      value: '',
      line: this.line,
      column: this.column,
    };
  }

  public tokenize(): Token[] {
    const tokens: Token[] = [];
    let token = this.nextToken();

    while (token.type !== TokenType.EOF) {
      // Skip newlines for easier parsing
      if (token.type !== TokenType.NEWLINE) {
        tokens.push(token);
      }
      token = this.nextToken();
    }

    tokens.push(token); // Add EOF token
    return tokens;
  }
}
