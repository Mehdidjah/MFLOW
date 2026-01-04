const CLISection = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">CLI Compiler</h2>
          <p className="text-muted-foreground">Compile MFlow files from your terminal</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Installation */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Installation</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Install globally via npm:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">npm install -g mflow-compiler</code>
                </pre>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Or use npx directly:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">npx mflow-compiler compile input.mflow</code>
                </pre>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Verify installation:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">mflow --version</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Basic Usage */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Basic Usage</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground mb-2">Compile a single file:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">mflow compile artwork.mflow</code>
                </pre>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Specify output file:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">mflow compile artwork.mflow -o output.js</code>
                </pre>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-2">Watch mode for development:</p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-3 overflow-x-auto">
                  <code className="text-sm font-mono">mflow watch artwork.mflow</code>
                </pre>
              </div>
            </div>
          </div>

          {/* Commands Reference */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Commands Reference</h3>

            <div className="space-y-3">
              {[
                { cmd: 'mflow compile <file>', desc: 'Compile MFlow to JavaScript' },
                { cmd: 'mflow watch <file>', desc: 'Watch and recompile on changes' },
                { cmd: 'mflow run <file>', desc: 'Compile and execute immediately' },
                { cmd: 'mflow check <file>', desc: 'Validate syntax without compiling' },
                { cmd: 'mflow format <file>', desc: 'Format MFlow code' },
                { cmd: 'mflow init', desc: 'Create new MFlow project' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <code className="text-xs bg-code-bg px-2 py-1 rounded text-primary/80 font-mono whitespace-nowrap">
                    {item.cmd}
                  </code>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Flags & Options */}
          <div className="glass-card p-6">
            <h3 className="font-semibold mb-4">Flags & Options</h3>

            <div className="space-y-3">
              {[
                { flag: '-o, --output', desc: 'Output file path' },
                { flag: '-w, --watch', desc: 'Enable watch mode' },
                { flag: '-m, --minify', desc: 'Minify output JavaScript' },
                { flag: '-s, --sourcemap', desc: 'Generate source maps' },
                { flag: '--canvas <id>', desc: 'Target canvas element ID' },
                { flag: '--fps <number>', desc: 'Set animation frame rate' },
                { flag: '-v, --verbose', desc: 'Verbose error messages' },
                { flag: '--no-color', desc: 'Disable colored output' },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <code className="text-xs bg-code-bg px-2 py-1 rounded text-primary/80 font-mono whitespace-nowrap">
                    {item.flag}
                  </code>
                  <span className="text-sm text-muted-foreground">{item.desc}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Project Structure */}
          <div className="lg:col-span-2 glass-card p-6">
            <h3 className="font-semibold mb-4">Project Structure</h3>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Run <code className="text-primary/80">mflow init</code> to create a new project:
                </p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-4 text-sm font-mono">
{`my-project/
├── src/
│   ├── main.mflow      # Entry point
│   └── shapes/
│       └── custom.mflow
├── dist/               # Compiled output
├── mflow.config.json   # Project config
└── package.json`}
                </pre>
              </div>

              <div>
                <p className="text-sm text-muted-foreground mb-3">
                  Example <code className="text-primary/80">mflow.config.json</code>:
                </p>
                <pre className="bg-code-bg border border-code-border rounded-lg p-4 text-sm font-mono">
{`{
  "entry": "src/main.mflow",
  "output": "dist/bundle.js",
  "canvas": {
    "width": 800,
    "height": 600,
    "background": "#0D0B0A"
  },
  "minify": true,
  "sourcemap": true
}`}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CLISection;