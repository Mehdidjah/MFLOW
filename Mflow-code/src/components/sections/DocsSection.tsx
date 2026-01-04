const DOCS = {
  shapes: {
    title: 'Shapes',
    items: [
      { syntax: 'circle at (x, y) size r', desc: 'Draw a circle at position with radius r' },
      { syntax: 'rect at (x, y) width w height h', desc: 'Draw a rectangle' },
      { syntax: 'triangle (x1,y1) (x2,y2) (x3,y3)', desc: 'Draw a triangle with 3 points' },
      { syntax: 'line from (x1,y1) to (x2,y2)', desc: 'Draw a line between two points' },
      { syntax: 'ellipse at (x, y) width w height h', desc: 'Draw an ellipse' },
      { syntax: 'polygon (x1,y1) (x2,y2) ...', desc: 'Draw a polygon with n points' },
    ]
  },
  colors: {
    title: 'Colors & Style',
    items: [
      { syntax: 'color #RRGGBB', desc: 'Set fill color using hex' },
      { syntax: 'stroke #RRGGBB width n', desc: 'Set stroke color and width' },
      { syntax: 'opacity 0.5', desc: 'Set transparency (0-1)' },
      { syntax: 'glow intensity n', desc: 'Add glow effect' },
      { syntax: 'gradient from #A to #B', desc: 'Apply linear gradient' },
      { syntax: 'shadow blur n offset (x, y)', desc: 'Add drop shadow' },
    ]
  },
  animation: {
    title: 'Animation',
    items: [
      { syntax: 'move n direction', desc: 'Move shape (right, left, up, down)' },
      { syntax: 'rotate n', desc: 'Rotate n degrees per frame' },
      { syntax: 'scale factor', desc: 'Scale shape by factor' },
      { syntax: 'fade amount', desc: 'Fade opacity over time' },
      { syntax: 'pulse amplitude', desc: 'Pulsating scale effect' },
      { syntax: 'wave amplitude frequency', desc: 'Sine wave motion' },
      { syntax: 'bounce dampen', desc: 'Bounce off canvas edges' },
      { syntax: 'orbit angle distance', desc: 'Circular orbit motion' },
      { syntax: 'explode angle speed', desc: 'Particle explosion' },
      { syntax: 'path bezier (...)', desc: 'Follow bezier curve' },
    ]
  },
  variables: {
    title: 'Variables & Math',
    items: [
      { syntax: 'let name = value', desc: 'Declare a variable' },
      { syntax: '+ - * / %', desc: 'Arithmetic operators' },
      { syntax: 'sin(x) cos(x) tan(x)', desc: 'Trigonometry functions' },
      { syntax: 'random(min, max)', desc: 'Random number in range' },
      { syntax: 'abs(x) sqrt(x) pow(x,y)', desc: 'Math functions' },
      { syntax: 'PI, TAU, E', desc: 'Math constants' },
    ]
  },
  control: {
    title: 'Control Flow',
    items: [
      { syntax: 'repeat n { ... }', desc: 'Execute block n times' },
      { syntax: 'if condition { ... }', desc: 'Conditional execution' },
      { syntax: 'if ... else { ... }', desc: 'If-else branching' },
      { syntax: 'fn name(args) { ... }', desc: 'Define a function' },
      { syntax: 'return value', desc: 'Return from function' },
    ]
  },
  scenes: {
    title: 'Scenes & Layers',
    items: [
      { syntax: 'scene name { ... }', desc: 'Create named scene/layer' },
      { syntax: 'animate speed n { ... }', desc: 'Animation with speed control' },
      { syntax: 'onCollide action', desc: 'Collision handler' },
      { syntax: 'emit rate n { ... }', desc: 'Particle emitter' },
    ]
  }
};

const DocsSection = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Documentation</h2>
          <p className="text-muted-foreground">Complete language reference for MFlow</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Object.entries(DOCS).map(([key, section]) => (
            <div key={key} className="glass-card p-5">
              <h3 className="font-semibold mb-4">{section.title}</h3>

              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <div key={i} className="group">
                    <code className="text-xs bg-code-bg px-2 py-1 rounded text-primary/80 font-mono block mb-1">
                      {item.syntax}
                    </code>
                    <p className="text-xs text-muted-foreground pl-1">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Compiler Architecture */}
        <div className="mt-8 glass-card p-6">
          <h3 className="font-semibold mb-6">Compiler Architecture</h3>

          <div className="grid sm:grid-cols-5 gap-4 text-center">
            {[
              { step: '1', title: 'Lexer', desc: 'Tokenization' },
              { step: '2', title: 'Parser', desc: 'AST Building' },
              { step: '3', title: 'Analyzer', desc: 'Semantic Check' },
              { step: '4', title: 'Generator', desc: 'Code Output' },
              { step: '5', title: 'Runtime', desc: 'Canvas API' },
            ].map((phase, i) => (
              <div key={i} className="relative">
                <div className="bg-muted/50 rounded-lg p-4">
                  <div className="w-8 h-8 bg-primary/20 text-primary rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-semibold">
                    {phase.step}
                  </div>
                  <h4 className="font-medium text-sm">{phase.title}</h4>
                  <p className="text-xs text-muted-foreground">{phase.desc}</p>
                </div>
                {i < 4 && (
                  <div className="hidden sm:block absolute top-1/2 -right-2 transform -translate-y-1/2 text-muted-foreground">
                    →
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DocsSection;