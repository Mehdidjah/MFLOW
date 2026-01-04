import { useState, useEffect, useRef } from 'react';
import { Play, Code, Download, Copy, RotateCcw, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MFlowCompiler } from '@/compiler';
import { toast } from 'sonner';

const EXAMPLES = {
  shapes: {
    name: 'Basic Shapes',
    code: `// Draw colorful shapes
circle at (150, 200) size 60 color #F5A623
rect at (350, 200) width 100 height 80 color #E67E22
triangle (250, 350) (200, 450) (300, 450) color #D35400`
  },
  animation: {
    name: 'Animation',
    code: `// Animated circle
circle at (50, 250) size 50 color #F5A623

animate {
  move 3 right
  rotate 2
  pulse 0.5
}`
  },
  pattern: {
    name: 'Pattern',
    code: `// Generative pattern
repeat 6 {
  circle at (250, 250) size 60 color #F5A623
  animate {
    rotate 3
    wave 10
  }
}`
  },
  scene: {
    name: 'Scene',
    code: `// Complex scene with layers
scene background {
  rect at (250, 250) width 500 height 500 color #1A1A1A
}

scene foreground {
  circle at (150, 150) size 40 color #F5A623
  circle at (350, 150) size 40 color #E67E22
  
  animate {
    move 1 down
    bounce 0.8
  }
}`
  },
  particles: {
    name: 'Particles',
    code: `// Particle system
let i = 0
repeat 12 {
  let angle = i * 30
  circle at (250, 250) size 15 color #F5A623
  animate {
    explode angle speed 2
    fade 0.02
  }
  let i = i + 1
}`
  }
};

const EditorSection = () => {
  const [code, setCode] = useState(EXAMPLES.shapes.code);
  const [output, setOutput] = useState('');
  const [activeTab, setActiveTab] = useState<'code' | 'output' | 'preview'>('code');
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleCompile = () => {
    const compiler = new MFlowCompiler();
    const result = compiler.compile(code);

    if (result.success && result.output) {
      setOutput(result.output);
      setActiveTab('output');
      toast.success('Compiled successfully');
    } else {
      toast.error('Compilation failed', {
        description: result.errors?.join('\n'),
      });
    }
  };

  const handleRun = () => {
    handleCompile();
    setTimeout(() => setActiveTab('preview'), 100);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output || code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('Copied to clipboard');
  };

  const handleDownload = () => {
    if (!output) {
      toast.error('Compile first to download');
      return;
    }
    const blob = new Blob([output], { type: 'text/javascript' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mflow-output.js';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded');
  };

  const handleReset = () => {
    setCode(EXAMPLES.shapes.code);
    setOutput('');
    setActiveTab('code');
  };

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Playground</h2>
          <p className="text-muted-foreground">Write, compile, and preview your creative code</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Examples Sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <div className="glass-card p-4">
              <h3 className="text-sm font-semibold text-primary mb-3">Examples</h3>
              <div className="space-y-1">
                {Object.entries(EXAMPLES).map(([key, example]) => (
                  <button
                    key={key}
                    onClick={() => setCode(example.code)}
                    className="w-full px-3 py-2 text-left text-sm rounded-md hover:bg-muted/50 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {example.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Reference */}
            <div className="glass-card p-4 hidden lg:block">
              <h3 className="text-sm font-semibold text-primary mb-3">Quick Reference</h3>
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <code className="text-primary/80">let x = 10</code>
                  <span className="text-muted-foreground">Variable</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-primary/80">circle at (x,y)</code>
                  <span className="text-muted-foreground">Shape</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-primary/80">animate {'{}'}</code>
                  <span className="text-muted-foreground">Animation</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-primary/80">repeat n {'{}'}</code>
                  <span className="text-muted-foreground">Loop</span>
                </div>
                <div className="flex justify-between">
                  <code className="text-primary/80">scene name {'{}'}</code>
                  <span className="text-muted-foreground">Scene</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Editor Area */}
          <div className="lg:col-span-9">
            <div className="glass-card overflow-hidden">
              {/* Toolbar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 border-b border-border">
                <div className="flex gap-1 p-1 bg-muted/50 rounded-lg">
                  {(['code', 'output', 'preview'] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-1.5 text-sm font-medium rounded-md transition-all ${
                        activeTab === tab
                          ? 'bg-background text-foreground shadow-sm'
                          : 'text-muted-foreground hover:text-foreground'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-muted-foreground"
                  >
                    <RotateCcw className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopy}
                    className="text-muted-foreground"
                  >
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleCompile}
                  >
                    <Code className="w-4 h-4 mr-2" />
                    Compile
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleRun}
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Run
                  </Button>
                  {output && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleDownload}
                    >
                      <Download className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>

              {/* Editor Content */}
              <div className="p-4">
                {activeTab === 'code' && (
                  <textarea
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full h-[400px] bg-code-bg border border-code-border rounded-lg p-4 font-mono text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30"
                    placeholder="Write your MFlow code here..."
                    spellCheck={false}
                  />
                )}

                {activeTab === 'output' && (
                  <pre className="w-full h-[400px] bg-code-bg border border-code-border rounded-lg p-4 font-mono text-sm overflow-auto">
                    <code className="text-muted-foreground">
                      {output || '// Compile your code to see the JavaScript output'}
                    </code>
                  </pre>
                )}

                {activeTab === 'preview' && (
                  <div className="flex items-center justify-center h-[400px] bg-code-bg border border-code-border rounded-lg">
                    <canvas
                      ref={canvasRef}
                      width={500}
                      height={350}
                      className="bg-background rounded border border-border"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EditorSection;
