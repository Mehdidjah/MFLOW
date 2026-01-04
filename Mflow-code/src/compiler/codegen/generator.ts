import * as AST from '../ast/nodes';

export class CodeGenerator {
  private indent: number = 0;
  private output: string = '';

  private emit(code: string): void {
    this.output += code;
  }

  private emitLine(code: string): void {
    this.emit('  '.repeat(this.indent) + code + '\n');
  }

  private emitIndent(): void {
    this.emit('  '.repeat(this.indent));
  }

  public generate(program: AST.Program): string {
    this.output = '';
    this.indent = 0;

    // Runtime setup
    this.emitLine('// MFlow compiled output - Enhanced Version');
    this.emitLine('const canvas = document.getElementById("mflow-canvas");');
    this.emitLine('if (!canvas) { console.error("Canvas not found: mflow-canvas"); }');
    this.emitLine('const ctx = canvas.getContext("2d");');
    this.emitLine('if (!ctx) { console.error("Cannot get 2D context"); }');
    this.emitLine('');
    this.emitLine('// Initialize MFlow runtime');
    this.emitLine('(function() {');
    this.indent++;
    this.emitLine('const mflow = {');
    this.indent++;
    this.emitLine('mouseX: 0,');
    this.emitLine('mouseY: 0,');
    this.emitLine('time: 0,');
    this.emitLine('frameCount: 0,');
    this.emitLine('keys: {},');
    this.emitLine('canvas: canvas,');
    this.emitLine('ctx: ctx');
    this.indent--;
    this.emitLine('};');
    this.emitLine('window.mflow = mflow;');
    this.emitLine('document.addEventListener("mousemove", (e) => {');
    this.indent++;
    this.emitLine('const rect = canvas.getBoundingClientRect();');
    this.emitLine('mflow.mouseX = e.clientX - rect.left;');
    this.emitLine('mflow.mouseY = e.clientY - rect.top;');
    this.indent--;
    this.emitLine('});');
    this.emitLine('document.addEventListener("keydown", (e) => { mflow.keys[e.key] = true; });');
    this.emitLine('document.addEventListener("keyup", (e) => { mflow.keys[e.key] = false; });');
    this.emitLine('function updateTime() { mflow.time += 0.016; mflow.frameCount++; requestAnimationFrame(updateTime); }');
    this.emitLine('updateTime();');
    this.indent--;
    this.emitLine('})();');
    this.emitLine('');
    this.emitLine('// Math functions (built-in)');
    this.emitLine('const sin = Math.sin, cos = Math.cos, tan = Math.tan;');
    this.emitLine('const sqrt = Math.sqrt, pow = Math.pow, abs = Math.abs;');
    this.emitLine('const floor = Math.floor, ceil = Math.ceil, round = Math.round;');
    this.emitLine('const min = Math.min, max = Math.max;');
    this.emitLine('const random = (min, max) => max === undefined ? Math.random() * min : Math.random() * (max - min) + min;');
    this.emitLine('const noise = (x, y, z) => { const n = x * 12.9898 + y * 78.233 + (z || 0) * 37.719; return ((Math.sin(n) * 43758.5453123) % 1 + 1) / 2; };');
    this.emitLine('const PI = Math.PI, TWO_PI = Math.PI * 2;');
    this.emitLine('const mouseX = () => window.mflow.mouseX;');
    this.emitLine('const mouseY = () => window.mflow.mouseY;');
    this.emitLine('const time = () => window.mflow.time;');
    this.emitLine('const frameCount = () => window.mflow.frameCount;');
    this.emitLine('');
    this.emitLine('// Animation state');
    this.emitLine('let animationState = {');
    this.indent++;
    this.emitLine('x: 0,');
    this.emitLine('y: 0,');
    this.emitLine('rotation: 0,');
    this.emitLine('scale: 1,');
    this.emitLine('opacity: 1');
    this.indent--;
    this.emitLine('};');
    this.emitLine('');
    this.emitLine('// Helper functions');
    this.emitLine('function resetTransform() {');
    this.indent++;
    this.emitLine('ctx.setTransform(1, 0, 0, 1, 0, 0);');
    this.indent--;
    this.emitLine('}');
    this.emitLine('');
    this.emitLine('function applyTransform(x, y) {');
    this.indent++;
    this.emitLine('ctx.translate(x + animationState.x, y + animationState.y);');
    this.emitLine('ctx.rotate(animationState.rotation * Math.PI / 180);');
    this.emitLine('ctx.scale(animationState.scale, animationState.scale);');
    this.emitLine('ctx.globalAlpha = animationState.opacity;');
    this.indent--;
    this.emitLine('}');
    this.emitLine('');
    this.emitLine('// Clear canvas');
    this.emitLine('function clear() {');
    this.indent++;
    this.emitLine('ctx.clearRect(0, 0, canvas.width, canvas.height);');
    this.indent--;
    this.emitLine('}');
    this.emitLine('');
    this.emitLine('// Main program');
    this.emitLine('(function main() {');
    this.indent++;

    for (const statement of program.body) {
      this.generateStatement(statement);
    }

    this.indent--;
    this.emitLine('})();');

    return this.output;
  }

  private generateStatement(stmt: AST.Statement): void {
    switch (stmt.type) {
      case AST.NodeType.LET_STATEMENT:
        this.generateLetStatement(stmt);
        break;
      case AST.NodeType.FUNCTION_DECLARATION:
        this.generateFunctionDeclaration(stmt);
        break;
      case AST.NodeType.RETURN_STATEMENT:
        this.emitIndent();
        this.emit('return');
        if (stmt.value) {
          this.emit(' ');
          this.generateExpression(stmt.value);
        }
        this.emit(';\n');
        break;
      case AST.NodeType.IF_STATEMENT:
        this.generateIfStatement(stmt);
        break;
      case AST.NodeType.REPEAT_STATEMENT:
        this.generateRepeatStatement(stmt);
        break;
      case AST.NodeType.WHILE_STATEMENT:
        this.generateWhileStatement(stmt);
        break;
      case AST.NodeType.FOR_STATEMENT:
        this.generateForStatement(stmt);
        break;
      case AST.NodeType.ANIMATE_BLOCK:
        this.generateAnimateBlock(stmt);
        break;
      case AST.NodeType.SCENE_BLOCK:
        this.generateSceneBlock(stmt);
        break;
      case AST.NodeType.IMPORT_STATEMENT:
        // Imports are handled at compile time, skip
        break;
      case AST.NodeType.EXPRESSION_STATEMENT:
        this.emitIndent();
        this.generateExpression(stmt.expression);
        this.emit(';\n');
        break;
    }
  }

  private generateLetStatement(stmt: AST.LetStatement): void {
    this.emitIndent();
    this.emit(`let ${stmt.identifier.name} = `);
    this.generateExpression(stmt.value);
    this.emit(';\n');
  }

  private generateFunctionDeclaration(stmt: AST.FunctionDeclaration): void {
    this.emitIndent();
    this.emit(`function ${stmt.name.name}(`);
    this.emit(stmt.parameters.map(p => p.name).join(', '));
    this.emit(') {\n');
    this.indent++;

    for (const bodyStmt of stmt.body) {
      this.generateStatement(bodyStmt);
    }

    this.indent--;
    this.emitLine('}');
  }

  private generateIfStatement(stmt: AST.IfStatement): void {
    this.emitIndent();
    this.emit('if (');
    this.generateExpression(stmt.condition);
    this.emit(') {\n');
    this.indent++;

    for (const thenStmt of stmt.thenBranch) {
      this.generateStatement(thenStmt);
    }

    this.indent--;

    if (stmt.elseBranch) {
      this.emitLine('} else {');
      this.indent++;

      for (const elseStmt of stmt.elseBranch) {
        this.generateStatement(elseStmt);
      }

      this.indent--;
    }

    this.emitLine('}');
  }

  private generateRepeatStatement(stmt: AST.RepeatStatement): void {
    this.emitIndent();
    this.emit('for (let __i = 0; __i < ');
    this.generateExpression(stmt.times);
    this.emit('; __i++) {\n');
    this.indent++;

    for (const bodyStmt of stmt.body) {
      this.generateStatement(bodyStmt);
    }

    this.indent--;
    this.emitLine('}');
  }

  private generateWhileStatement(stmt: AST.WhileStatement): void {
    this.emitIndent();
    this.emit('while (');
    this.generateExpression(stmt.condition);
    this.emit(') {\n');
    this.indent++;

    for (const bodyStmt of stmt.body) {
      this.generateStatement(bodyStmt);
    }

    this.indent--;
    this.emitLine('}');
  }

  private generateForStatement(stmt: AST.ForStatement): void {
    this.emitIndent();
    this.emit('for (');
    if (stmt.init) {
      // For loop init should not have semicolon/newline
      const savedOutput = this.output;
      const savedIndent = this.indent;
      this.indent = 0;
      this.generateStatement(stmt.init);
      // Extract just the statement without indent/newline
      const generated = this.output.substring(savedOutput.length);
      this.output = savedOutput;
      this.indent = savedIndent;
      // Remove trailing semicolon and newline
      const cleaned = generated.replace(/;\s*\n?$/, '');
      this.emit(cleaned);
    } else {
      this.emit(';');
    }
    this.emit(' ');
    this.generateExpression(stmt.condition);
    this.emit('; ');
    if (stmt.update) {
      this.generateExpression(stmt.update);
    }
    this.emit(') {\n');
    this.indent++;

    for (const bodyStmt of stmt.body) {
      this.generateStatement(bodyStmt);
    }

    this.indent--;
    this.emitLine('}');
  }

  private generateAnimateBlock(stmt: AST.AnimateBlock): void {
    this.emitLine('// Animation loop');
    this.emitLine('function animate() {');
    this.indent++;
    this.emitLine('clear();');

    for (const anim of stmt.animations) {
      this.generateAnimationCommand(anim);
    }

    this.emitLine('requestAnimationFrame(animate);');
    this.indent--;
    this.emitLine('}');
    this.emitLine('animate();');
  }

  private generateAnimationCommand(cmd: AST.AnimationCommand): void {
    switch (cmd.type) {
      case AST.NodeType.MOVE:
        this.emitIndent();
        const axis = cmd.direction === 'left' || cmd.direction === 'right' ? 'x' : 'y';
        const sign = cmd.direction === 'left' || cmd.direction === 'up' ? '-' : '+';
        this.emit(`animationState.${axis} ${sign}= `);
        this.generateExpression(cmd.amount);
        this.emit(';\n');
        break;
      case AST.NodeType.ROTATE:
        this.emitIndent();
        this.emit('animationState.rotation += ');
        this.generateExpression(cmd.angle);
        this.emit(';\n');
        break;
      case AST.NodeType.SCALE:
        this.emitIndent();
        this.emit('animationState.scale *= ');
        this.generateExpression(cmd.factor);
        this.emit(';\n');
        break;
      case AST.NodeType.FADE:
        this.emitIndent();
        this.emit('animationState.opacity -= ');
        this.generateExpression(cmd.amount);
        this.emit(';\n');
        break;
      case AST.NodeType.BOUNCE:
        this.emitIndent();
        this.emit('// Bounce animation');
        this.emit('animationState.y = Math.abs(Math.sin(time() * 2)) * 100;\n');
        break;
      case AST.NodeType.WAVE:
        this.emitIndent();
        this.emit('animationState.x = Math.sin(time() * ');
        this.generateExpression(cmd.frequency);
        this.emit(') * ');
        this.generateExpression(cmd.amplitude);
        this.emit(';\n');
        break;
      case AST.NodeType.ORBIT:
        this.emitIndent();
        this.emit('const orbitAngle = time() * ');
        this.generateExpression(cmd.speed);
        this.emit(';\n');
        this.emitIndent();
        this.emit('animationState.x = ');
        this.generateExpression(cmd.centerX);
        this.emit(' + Math.cos(orbitAngle) * ');
        this.generateExpression(cmd.radius);
        this.emit(';\n');
        this.emitIndent();
        this.emit('animationState.y = ');
        this.generateExpression(cmd.centerY);
        this.emit(' + Math.sin(orbitAngle) * ');
        this.generateExpression(cmd.radius);
        this.emit(';\n');
        break;
      case AST.NodeType.PULSE:
        this.emitIndent();
        this.emit('const pulseValue = (Math.sin(time() * ');
        this.emit(cmd.speed ? '' : '1');
        if (cmd.speed) this.generateExpression(cmd.speed);
        this.emit(') + 1) / 2;\n');
        this.emitIndent();
        this.emit('animationState.scale = ');
        this.generateExpression(cmd.minScale);
        this.emit(' + (');
        this.generateExpression(cmd.maxScale);
        this.emit(' - ');
        this.generateExpression(cmd.minScale);
        this.emit(') * pulseValue;\n');
        break;
      case AST.NodeType.WOBBLE:
        this.emitIndent();
        this.emit('animationState.rotation = Math.sin(time() * ');
        this.emit(cmd.speed ? '' : '5');
        if (cmd.speed) this.generateExpression(cmd.speed);
        this.emit(') * ');
        this.generateExpression(cmd.amount);
        this.emit(';\n');
        break;
      case AST.NodeType.SPRING:
        this.emitIndent();
        this.emit('// Spring animation');
        this.emit('const springStiffness = ');
        this.emit(cmd.stiffness ? '' : '0.1');
        if (cmd.stiffness) this.generateExpression(cmd.stiffness);
        this.emit(';\n');
        this.emitIndent();
        this.emit('const dx = ');
        this.generateExpression(cmd.targetX);
        this.emit(' - animationState.x;\n');
        this.emitIndent();
        this.emit('const dy = ');
        this.generateExpression(cmd.targetY);
        this.emit(' - animationState.y;\n');
        this.emitIndent();
        this.emit('animationState.x += dx * springStiffness;\n');
        this.emitIndent();
        this.emit('animationState.y += dy * springStiffness;\n');
        break;
    }
  }

  private generateSceneBlock(stmt: AST.SceneBlock): void {
    this.emitLine(`// Scene: ${stmt.name}`);
    this.emitLine(`function scene_${stmt.name}() {`);
    this.indent++;

    for (const bodyStmt of stmt.body) {
      this.generateStatement(bodyStmt);
    }

    this.indent--;
    this.emitLine('}');
    this.emitLine(`scene_${stmt.name}();`);
  }

  private generateExpression(expr: AST.Expression): void {
    switch (expr.type) {
      case AST.NodeType.NUMBER_LITERAL:
        this.emit(expr.value.toString());
        break;
      case AST.NodeType.STRING_LITERAL:
        this.emit(`"${expr.value.replace(/"/g, '\\"')}"`);
        break;
      case AST.NodeType.COLOR_LITERAL:
        this.emit(`"${expr.value}"`);
        break;
      case AST.NodeType.BOOLEAN_LITERAL:
        this.emit(expr.value ? 'true' : 'false');
        break;
      case AST.NodeType.NULL_LITERAL:
        this.emit('null');
        break;
      case AST.NodeType.ARRAY_LITERAL:
        this.emit('[');
        expr.elements.forEach((elem, i) => {
          if (i > 0) this.emit(', ');
          this.generateExpression(elem);
        });
        this.emit(']');
        break;
      case AST.NodeType.OBJECT_LITERAL:
        this.emit('{');
        expr.properties.forEach((prop, i) => {
          if (i > 0) this.emit(', ');
          this.emit(`"${prop.key}": `);
          this.generateExpression(prop.value);
        });
        this.emit('}');
        break;
      case AST.NodeType.IDENTIFIER:
        this.emit(expr.name);
        break;
      case AST.NodeType.BINARY_EXPRESSION:
        this.emit('(');
        this.generateExpression(expr.left);
        this.emit(` ${expr.operator} `);
        this.generateExpression(expr.right);
        this.emit(')');
        break;
      case AST.NodeType.CALL_EXPRESSION:
        this.generateExpression(expr.callee);
        this.emit('(');
        expr.arguments.forEach((arg, i) => {
          if (i > 0) this.emit(', ');
          this.generateExpression(arg);
        });
        this.emit(')');
        break;
      case AST.NodeType.MEMBER_EXPRESSION:
        this.generateExpression(expr.object);
        this.emit('.');
        this.emit(expr.property.name);
        break;
      case AST.NodeType.INDEX_EXPRESSION:
        this.generateExpression(expr.object);
        this.emit('[');
        this.generateExpression(expr.index);
        this.emit(']');
        break;
      case AST.NodeType.CIRCLE:
        this.generateCircle(expr);
        break;
      case AST.NodeType.RECT:
        this.generateRect(expr);
        break;
      case AST.NodeType.LINE:
        this.generateLine(expr);
        break;
      case AST.NodeType.TRIANGLE:
        this.generateTriangle(expr);
        break;
      case AST.NodeType.POLYGON:
        this.generatePolygon(expr);
        break;
      case AST.NodeType.ELLIPSE:
        this.generateEllipse(expr);
        break;
      case AST.NodeType.ARC:
        this.generateArc(expr);
        break;
      case AST.NodeType.TEXT:
        this.generateText(expr);
        break;
    }
  }

  private generateCircle(expr: AST.Circle): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const size = ');
    this.generateExpression(expr.size);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('applyTransform(x, y);');
    this.emitLine('ctx.beginPath();');
    this.emitLine('ctx.arc(0, 0, size, 0, Math.PI * 2);');
    this.emitLine('ctx.fillStyle = color;');
    this.emitLine('ctx.fill();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateRect(expr: AST.Rect): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const w = ');
    this.generateExpression(expr.width);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const h = ');
    this.generateExpression(expr.height);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('applyTransform(x, y);');
    this.emitLine('ctx.fillStyle = color;');
    this.emitLine('ctx.fillRect(-w/2, -h/2, w, h);');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateLine(expr: AST.Line): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('ctx.strokeStyle = color;');
    this.emitLine('ctx.beginPath();');
    this.emitIndent();
    this.emit('ctx.moveTo(');
    this.generateExpression(expr.start.x);
    this.emit(', ');
    this.generateExpression(expr.start.y);
    this.emit(');\n');
    this.emitIndent();
    this.emit('ctx.lineTo(');
    this.generateExpression(expr.end.x);
    this.emit(', ');
    this.generateExpression(expr.end.y);
    this.emit(');\n');
    this.emitLine('ctx.stroke();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateTriangle(expr: AST.Triangle): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('ctx.fillStyle = color;');
    this.emitLine('ctx.beginPath();');
    
    expr.points.forEach((point, i) => {
      this.emitIndent();
      this.emit(i === 0 ? 'ctx.moveTo(' : 'ctx.lineTo(');
      this.generateExpression(point.x);
      this.emit(', ');
      this.generateExpression(point.y);
      this.emit(');\n');
    });
    
    this.emitLine('ctx.closePath();');
    this.emitLine('ctx.fill();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generatePolygon(expr: AST.Polygon): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const sides = ');
    this.generateExpression(expr.sides);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const radius = ');
    this.generateExpression(expr.radius);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    if (expr.rotation) {
      this.emitIndent();
      this.emit('const rotation = ');
      this.generateExpression(expr.rotation);
      this.emit(';\n');
    }
    this.emitLine('ctx.fillStyle = color;');
    this.emitLine('ctx.beginPath();');
    this.emitLine('for (let i = 0; i < sides; i++) {');
    this.indent++;
    this.emitLine('const angle = (i * TWO_PI / sides) + (rotation || 0);');
    this.emitLine('const px = x + Math.cos(angle) * radius;');
    this.emitLine('const py = y + Math.sin(angle) * radius;');
    this.emitLine('if (i === 0) ctx.moveTo(px, py);');
    this.emitLine('else ctx.lineTo(px, py);');
    this.indent--;
    this.emitLine('}');
    this.emitLine('ctx.closePath();');
    this.emitLine('ctx.fill();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateEllipse(expr: AST.Ellipse): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const radiusX = ');
    this.generateExpression(expr.radiusX);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const radiusY = ');
    this.generateExpression(expr.radiusY);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('ctx.fillStyle = color;');
    this.emitLine('ctx.beginPath();');
    this.emitLine('ctx.ellipse(x, y, radiusX, radiusY, 0, 0, TWO_PI);');
    this.emitLine('ctx.fill();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateArc(expr: AST.Arc): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const radius = ');
    this.generateExpression(expr.radius);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const startAngle = ');
    this.generateExpression(expr.startAngle);
    this.emit(' * Math.PI / 180;\n');
    this.emitIndent();
    this.emit('const endAngle = ');
    this.generateExpression(expr.endAngle);
    this.emit(' * Math.PI / 180;\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    this.emitLine('ctx.strokeStyle = color;');
    this.emitLine('ctx.beginPath();');
    this.emitLine('ctx.arc(x, y, radius, startAngle, endAngle, ' + (expr.counterclockwise ? 'true' : 'false') + ');');
    this.emitLine('ctx.stroke();');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }

  private generateText(expr: AST.Text): void {
    this.emit('(function() {\n');
    this.indent++;
    this.emitLine('ctx.save();');
    this.emitIndent();
    this.emit('const x = ');
    this.generateExpression(expr.position.x);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const y = ');
    this.generateExpression(expr.position.y);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const text = ');
    this.generateExpression(expr.content);
    this.emit(';\n');
    this.emitIndent();
    this.emit('const color = ');
    this.generateExpression(expr.color);
    this.emit(';\n');
    if (expr.font) {
      this.emitIndent();
      this.emit('ctx.font = ');
      this.generateExpression(expr.font);
      this.emit(';\n');
    }
    if (expr.size) {
      this.emitIndent();
      this.emit('const fontSize = ');
      this.generateExpression(expr.size);
      this.emit(';\n');
      this.emitLine('ctx.font = (fontSize || 16) + "px sans-serif";');
    }
    this.emitLine('ctx.fillStyle = color;');
    if (expr.align) {
      this.emitLine('ctx.textAlign = "' + expr.align + '";');
    }
    this.emitLine('ctx.fillText(String(text), x, y);');
    this.emitLine('ctx.restore();');
    this.indent--;
    this.emitIndent();
    this.emit('})()');
  }
}
