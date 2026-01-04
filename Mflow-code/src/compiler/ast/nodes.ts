// AST Node types for MFlow language

export enum NodeType {
  PROGRAM = 'Program',
  
  // Statements
  LET_STATEMENT = 'LetStatement',
  FUNCTION_DECLARATION = 'FunctionDeclaration',
  RETURN_STATEMENT = 'ReturnStatement',
  IF_STATEMENT = 'IfStatement',
  REPEAT_STATEMENT = 'RepeatStatement',
  WHILE_STATEMENT = 'WhileStatement',
  FOR_STATEMENT = 'ForStatement',
  ANIMATE_BLOCK = 'AnimateBlock',
  SCENE_BLOCK = 'SceneBlock',
  EXPRESSION_STATEMENT = 'ExpressionStatement',
  IMPORT_STATEMENT = 'ImportStatement',
  
  // Expressions
  IDENTIFIER = 'Identifier',
  NUMBER_LITERAL = 'NumberLiteral',
  STRING_LITERAL = 'StringLiteral',
  COLOR_LITERAL = 'ColorLiteral',
  BOOLEAN_LITERAL = 'BooleanLiteral',
  NULL_LITERAL = 'NullLiteral',
  ARRAY_LITERAL = 'ArrayLiteral',
  OBJECT_LITERAL = 'ObjectLiteral',
  BINARY_EXPRESSION = 'BinaryExpression',
  CALL_EXPRESSION = 'CallExpression',
  MEMBER_EXPRESSION = 'MemberExpression',
  INDEX_EXPRESSION = 'IndexExpression',
  
  // Shapes
  CIRCLE = 'Circle',
  RECT = 'Rect',
  LINE = 'Line',
  TRIANGLE = 'Triangle',
  POLYGON = 'Polygon',
  ELLIPSE = 'Ellipse',
  ARC = 'Arc',
  TEXT = 'Text',
  
  // Animations
  MOVE = 'Move',
  ROTATE = 'Rotate',
  SCALE = 'Scale',
  FADE = 'Fade',
  BOUNCE = 'Bounce',
  WAVE = 'Wave',
  ORBIT = 'Orbit',
  PULSE = 'Pulse',
  WOBBLE = 'Wobble',
  SPRING = 'Spring',
}

export interface ASTNode {
  type: NodeType;
  line: number;
  column: number;
}

export interface Program extends ASTNode {
  type: NodeType.PROGRAM;
  body: Statement[];
}

// Statements
export type Statement =
  | LetStatement
  | FunctionDeclaration
  | ReturnStatement
  | IfStatement
  | RepeatStatement
  | WhileStatement
  | ForStatement
  | AnimateBlock
  | SceneBlock
  | ExpressionStatement
  | ImportStatement;

export interface LetStatement extends ASTNode {
  type: NodeType.LET_STATEMENT;
  identifier: Identifier;
  value: Expression;
}

export interface FunctionDeclaration extends ASTNode {
  type: NodeType.FUNCTION_DECLARATION;
  name: Identifier;
  parameters: Identifier[];
  body: Statement[];
}

export interface ReturnStatement extends ASTNode {
  type: NodeType.RETURN_STATEMENT;
  value: Expression | null;
}

export interface IfStatement extends ASTNode {
  type: NodeType.IF_STATEMENT;
  condition: Expression;
  thenBranch: Statement[];
  elseBranch: Statement[] | null;
}

export interface RepeatStatement extends ASTNode {
  type: NodeType.REPEAT_STATEMENT;
  times: Expression;
  body: Statement[];
}

export interface WhileStatement extends ASTNode {
  type: NodeType.WHILE_STATEMENT;
  condition: Expression;
  body: Statement[];
}

export interface ForStatement extends ASTNode {
  type: NodeType.FOR_STATEMENT;
  init: Statement | null;
  condition: Expression;
  update: Expression | null;
  body: Statement[];
}

export interface ImportStatement extends ASTNode {
  type: NodeType.IMPORT_STATEMENT;
  module: string;
  imports: string[];
}

export interface AnimateBlock extends ASTNode {
  type: NodeType.ANIMATE_BLOCK;
  animations: AnimationCommand[];
}

export interface SceneBlock extends ASTNode {
  type: NodeType.SCENE_BLOCK;
  name: string;
  body: Statement[];
}

export interface ExpressionStatement extends ASTNode {
  type: NodeType.EXPRESSION_STATEMENT;
  expression: Expression;
}

// Expressions
export type Expression =
  | Identifier
  | NumberLiteral
  | StringLiteral
  | ColorLiteral
  | BooleanLiteral
  | NullLiteral
  | ArrayLiteral
  | ObjectLiteral
  | BinaryExpression
  | CallExpression
  | MemberExpression
  | IndexExpression
  | ShapeExpression
  | AnimationCommand;

export interface Identifier extends ASTNode {
  type: NodeType.IDENTIFIER;
  name: string;
}

export interface NumberLiteral extends ASTNode {
  type: NodeType.NUMBER_LITERAL;
  value: number;
}

export interface StringLiteral extends ASTNode {
  type: NodeType.STRING_LITERAL;
  value: string;
}

export interface ColorLiteral extends ASTNode {
  type: NodeType.COLOR_LITERAL;
  value: string;
}

export interface BooleanLiteral extends ASTNode {
  type: NodeType.BOOLEAN_LITERAL;
  value: boolean;
}

export interface NullLiteral extends ASTNode {
  type: NodeType.NULL_LITERAL;
}

export interface ArrayLiteral extends ASTNode {
  type: NodeType.ARRAY_LITERAL;
  elements: Expression[];
}

export interface ObjectLiteral extends ASTNode {
  type: NodeType.OBJECT_LITERAL;
  properties: Array<{ key: string; value: Expression }>;
}

export interface BinaryExpression extends ASTNode {
  type: NodeType.BINARY_EXPRESSION;
  operator: string;
  left: Expression;
  right: Expression;
}

export interface CallExpression extends ASTNode {
  type: NodeType.CALL_EXPRESSION;
  callee: Expression;
  arguments: Expression[];
}

export interface MemberExpression extends ASTNode {
  type: NodeType.MEMBER_EXPRESSION;
  object: Expression;
  property: Identifier;
}

export interface IndexExpression extends ASTNode {
  type: NodeType.INDEX_EXPRESSION;
  object: Expression;
  index: Expression;
}

// Shapes
export type ShapeExpression = Circle | Rect | Line | Triangle | Polygon | Ellipse | Arc | Text;

export interface Circle extends ASTNode {
  type: NodeType.CIRCLE;
  position: { x: Expression; y: Expression };
  size: Expression;
  color: Expression;
}

export interface Rect extends ASTNode {
  type: NodeType.RECT;
  position: { x: Expression; y: Expression };
  width: Expression;
  height: Expression;
  color: Expression;
}

export interface Line extends ASTNode {
  type: NodeType.LINE;
  start: { x: Expression; y: Expression };
  end: { x: Expression; y: Expression };
  color: Expression;
}

export interface Triangle extends ASTNode {
  type: NodeType.TRIANGLE;
  points: Array<{ x: Expression; y: Expression }>;
  color: Expression;
}

export interface Polygon extends ASTNode {
  type: NodeType.POLYGON;
  position: { x: Expression; y: Expression };
  sides: Expression;
  radius: Expression;
  color: Expression;
  rotation?: Expression;
}

export interface Ellipse extends ASTNode {
  type: NodeType.ELLIPSE;
  position: { x: Expression; y: Expression };
  radiusX: Expression;
  radiusY: Expression;
  color: Expression;
  rotation?: Expression;
}

export interface Arc extends ASTNode {
  type: NodeType.ARC;
  position: { x: Expression; y: Expression };
  radius: Expression;
  startAngle: Expression;
  endAngle: Expression;
  color: Expression;
  counterclockwise?: boolean;
}

export interface Text extends ASTNode {
  type: NodeType.TEXT;
  position: { x: Expression; y: Expression };
  content: Expression;
  color: Expression;
  font?: Expression;
  size?: Expression;
  align?: 'left' | 'center' | 'right';
}

// Animation Commands
export type AnimationCommand = Move | Rotate | Scale | Fade | Bounce | Wave | Orbit | Pulse | Wobble | Spring;

export interface Move extends ASTNode {
  type: NodeType.MOVE;
  amount: Expression;
  direction: 'up' | 'down' | 'left' | 'right';
}

export interface Rotate extends ASTNode {
  type: NodeType.ROTATE;
  angle: Expression;
}

export interface Scale extends ASTNode {
  type: NodeType.SCALE;
  factor: Expression;
}

export interface Fade extends ASTNode {
  type: NodeType.FADE;
  amount: Expression;
}

export interface Bounce extends ASTNode {
  type: NodeType.BOUNCE;
  damping?: Expression;
}

export interface Wave extends ASTNode {
  type: NodeType.WAVE;
  amplitude: Expression;
  frequency: Expression;
}

export interface Orbit extends ASTNode {
  type: NodeType.ORBIT;
  centerX: Expression;
  centerY: Expression;
  radius: Expression;
  speed: Expression;
}

export interface Pulse extends ASTNode {
  type: NodeType.PULSE;
  minScale: Expression;
  maxScale: Expression;
  speed?: Expression;
}

export interface Wobble extends ASTNode {
  type: NodeType.WOBBLE;
  amount: Expression;
  speed?: Expression;
}

export interface Spring extends ASTNode {
  type: NodeType.SPRING;
  targetX: Expression;
  targetY: Expression;
  stiffness?: Expression;
  damping?: Expression;
}
