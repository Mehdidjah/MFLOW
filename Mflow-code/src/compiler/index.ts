import { Lexer } from './lexer/lexer';
import { Parser } from './parser/parser';
import { SemanticAnalyzer } from './semantic/analyzer';
import { CodeGenerator } from './codegen/generator';

export interface CompilationResult {
  success: boolean;
  output?: string;
  errors?: string[];
}

export class MFlowCompiler {
  public compile(sourceCode: string): CompilationResult {
    try {
      // Lexical analysis
      const lexer = new Lexer(sourceCode);
      const tokens = lexer.tokenize();

      // Syntax analysis (parsing)
      const parser = new Parser(tokens);
      const ast = parser.parse();

      // Semantic analysis
      const analyzer = new SemanticAnalyzer();
      const semanticErrors = analyzer.analyze(ast);

      if (semanticErrors.length > 0) {
        return {
          success: false,
          errors: semanticErrors.map(e => e.message),
        };
      }

      // Code generation
      const generator = new CodeGenerator();
      const output = generator.generate(ast);

      return {
        success: true,
        output,
      };
    } catch (error) {
      return {
        success: false,
        errors: [error instanceof Error ? error.message : String(error)],
      };
    }
  }
}

export * from './lexer/tokens';
export * from './ast/nodes';
