# MFlow

**A creative programming language and compiler for generative art, animations, and interactive visuals.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

MFlow is a complete custom programming language and compiler built from scratch with TypeScript. It's designed for artists, creative coders, and anyone who wants to create visual art through code without the complexity of traditional programming languages.

## 🎨 What is MFlow?

MFlow is a domain-specific language (DSL) that compiles to JavaScript + Canvas API. You write simple, expressive code, and MFlow handles the complexity of rendering, animation loops, and canvas management.

### Example

```mflow
// Simple animated circle
circle at (250, 200) size 60 color #F5A623

animate {
  move 2 right
  rotate 1
  scale 1.01
}
```

This code compiles to JavaScript that runs in any browser with Canvas support.

## ✨ Features

### Core Language Features
- **Simple Syntax** - Clean, intuitive language designed for creative expression
- **Shapes** - Draw circles, rectangles, triangles, lines, polygons, ellipses, arcs, and text
- **Animations** - Move, rotate, scale, fade, bounce, wave, orbit, pulse, wobble, spring
- **Variables & Functions** - Full support for variables, functions, and control flow
- **Control Flow** - if/else, repeat loops, while loops, for loops
- **Scenes** - Organize complex compositions with layers

### Advanced Features
- **Math Functions** - sin, cos, tan, sqrt, pow, abs, floor, ceil, round, random, noise, min, max, lerp, map, constrain, dist, radians, degrees
- **Time-Based Animations** - `time()` and `frameCount` variables for smooth animations
- **Mouse Interaction** - `mouseX` and `mouseY` for interactive applications
- **Arrays & Objects** - Support for arrays, objects, and property access
- **Boolean & Null** - true, false, null literals

### Compiler Features
- **Full Compiler Pipeline** - Lexer, Parser, AST, Semantic Analyzer, Code Generator
- **TypeScript Implementation** - Fully typed, maintainable, and extensible
- **Error Handling** - Comprehensive error messages at all compilation stages
- **Real-time Compilation** - Instant feedback from source code to executable JavaScript

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/mflow.git
cd mflow

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
```

### Using the Web Playground

1. Start the dev server: `npm run dev`
2. Open your browser to the local URL (usually `http://localhost:5173`)
3. Write MFlow code in the editor
4. Click "Run" to compile and preview

### Program Structure

Every MFlow program needs a canvas element with id `mflow-canvas`:

```html
<canvas id="mflow-canvas" width="500" height="500"></canvas>
<script src="compiled-output.js"></script>
```

## 📖 Language Syntax

### Variables

```mflow
let x = 100
let speed = 2.5
let color = #F5A623
let name = "MFlow"
let isActive = true
let value = null
```

### Shapes

#### Circle
```mflow
circle at (x, y) size radius color #HEX
```

Example:
```mflow
circle at (250, 250) size 50 color #00FFFF
```

#### Rectangle
```mflow
rect at (x, y) width w height h color #HEX
```

Example:
```mflow
rect at (100, 100) width 80 height 60 color #FF00FF
```

#### Line
```mflow
line (x1, y1) (x2, y2) color #HEX
```

Example:
```mflow
line (50, 50) (200, 200) color #FFFFFF
```

#### Triangle
```mflow
triangle (x1, y1) (x2, y2) (x3, y3) color #HEX
```

Example:
```mflow
triangle (250, 100) (200, 200) (300, 200) color #FFFF00
```

#### Polygon
```mflow
polygon at (x, y) sides n radius r color #HEX
```

Example:
```mflow
polygon at (250, 250) sides 6 radius 50 color #FF0000
```

#### Ellipse
```mflow
ellipse at (x, y) radiusX rx radiusY ry color #HEX
```

Example:
```mflow
ellipse at (250, 250) radiusX 80 radiusY 40 color #00FF00
```

#### Arc
```mflow
arc at (x, y) radius r startAngle sa endAngle ea color #HEX
```

Example:
```mflow
arc at (250, 250) radius 50 startAngle 0 endAngle 180 color #0000FF
```

#### Text
```mflow
text at (x, y) content "text" color #HEX font "size family"
```

Example:
```mflow
text at (250, 250) content "Hello MFlow" color #FFFFFF font "20px Arial"
```

### Functions

```mflow
fn functionName(param1, param2) {
  // function body
  return value
}
```

Example:
```mflow
fn drawStar(x, y, size, color) {
  circle at (x, y) size size color color
  circle at (x, y) size size / 2 color #FFFFFF
}

drawStar(250, 250, 50, #FFFF00)
```

### Control Flow

#### Conditionals
```mflow
if condition {
  // then branch
} else {
  // else branch
}
```

Example:
```mflow
if x > 100 {
  circle at (x, 100) size 30 color #00FFFF
} else {
  rect at (x, 100) width 40 height 40 color #FF00FF
}
```

#### Repeat Loop
```mflow
repeat times {
  // loop body
}
```

Example:
```mflow
let x = 50
repeat 10 {
  circle at (x, 250) size 20 color #00FFFF
  let x = x + 50
}
```

#### While Loop
```mflow
while condition {
  // loop body
}
```

Example:
```mflow
let x = 0
while x < 500 {
  circle at (x, 250) size 20 color #FF00FF
  let x = x + 50
}
```

### Animations

#### Basic Animation Block
```mflow
animate {
  move amount direction
  rotate angle
  scale factor
  fade amount
}
```

Example:
```mflow
circle at (250, 250) size 50 color #F5A623

animate {
  move 2 right
  rotate 1
  scale 1.01
  fade 0.01
}
```

#### Advanced Animations

**Bounce:**
```mflow
animate {
  bounce 0.8  // damping factor
}
```

**Wave:**
```mflow
animate {
  wave 10 0.5  // amplitude frequency
}
```

**Orbit:**
```mflow
animate {
  orbit 250 250 100 2  // centerX centerY radius speed
}
```

**Pulse:**
```mflow
animate {
  pulse 0.5 1.5 1.0  // minScale maxScale speed
}
```

**Wobble:**
```mflow
animate {
  wobble 5 2  // amount speed
}
```

**Spring:**
```mflow
animate {
  spring 300 300 0.1 0.9  // targetX targetY stiffness damping
}
```

### Math Functions

```mflow
sin(x), cos(x), tan(x)              // Trigonometric functions
sqrt(x), pow(x, y), abs(x)          // Power and root functions
floor(x), ceil(x), round(x)         // Rounding functions
random(min, max)                    // Random number generation
noise(x, y, z)                      // Perlin-like noise
min(a, b), max(a, b)                // Min/max functions
PI, TWO_PI                          // Mathematical constants
lerp(a, b, t)                       // Linear interpolation
map(value, start1, stop1, start2, stop2)  // Value mapping
constrain(value, min, max)          // Value constraining
dist(x1, y1, x2, y2)                // Distance calculation
radians(degrees), degrees(radians)  // Angle conversion
```

Example:
```mflow
let angle = time() * 2
let x = 250 + cos(angle) * 100
let y = 250 + sin(angle) * 100
circle at (x, y) size 50 color #FF0000
```

### Time & Interaction

```mflow
time()        // Elapsed time in seconds
frameCount    // Current frame number
mouseX        // Current mouse X position
mouseY        // Current mouse Y position
```

Example:
```mflow
// Mouse-following circle
circle at (mouseX, mouseY) size 30 color #00FFFF

// Time-based animation
let x = 250 + sin(time() * 2) * 100
circle at (x, 250) size 50 color #FF00FF
```

### Scenes

```mflow
scene sceneName {
  // scene content
}
```

Example:
```mflow
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
}
```

## 🏗️ Compiler Architecture

MFlow's compiler follows a traditional 5-phase architecture:

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

### 1. Lexer (Tokenization)
The lexer reads source code character by character and converts it into tokens (keywords, identifiers, numbers, operators).

### 2. Parser (AST Building)
Using recursive descent parsing, the parser builds an Abstract Syntax Tree (AST) representing the code structure.

### 3. Semantic Analyzer
Validates the AST for errors: undefined variables, type mismatches, invalid operations. Resolves scopes and validates parameters.

### 4. Code Generator
Traverses the validated AST and generates JavaScript code targeting the Canvas API.

### 5. Runtime
The generated JavaScript runs in any browser with Canvas support, managing animation loops and rendering.

## 📁 Project Structure

```
mflow/
├── src/
│   ├── compiler/
│   │   ├── lexer/        # Tokenization
│   │   │   ├── tokens.ts
│   │   │   └── lexer.ts
│   │   ├── parser/       # AST building
│   │   │   └── parser.ts
│   │   ├── ast/          # Node definitions
│   │   │   └── nodes.ts
│   │   ├── semantic/     # Analysis
│   │   │   └── analyzer.ts
│   │   ├── codegen/      # JavaScript output
│   │   │   └── generator.ts
│   │   ├── runtime/      # Runtime library
│   │   │   └── runtime.ts
│   │   └── index.ts      # Compiler entry point
│   ├── components/       # UI components
│   │   ├── layout/
│   │   ├── sections/
│   │   └── ui/
│   ├── pages/            # Web app pages
│   │   ├── Index.tsx
│   │   └── NotFound.tsx
│   └── main.tsx          # Entry point
├── examples/             # Example programs
│   ├── 01-basic-shapes.mflow
│   ├── 02-rotating-animation.mflow
│   ├── 03-moving-circle.mflow
│   ├── 04-color-gradient.mflow
│   ├── 05-generative-pattern.mflow
│   ├── 06-function-demo.mflow
│   ├── 07-conditional-art.mflow
│   └── 08-wave-motion.mflow
├── docs/                 # Documentation
│   ├── LANGUAGE_SPEC.md
│   └── COMPILER_ARCHITECTURE.md
├── public/               # Static assets
├── package.json
├── tsconfig.json
├── vite.config.ts
└── README.md
```

## 💻 Usage Examples

### Example 1: Basic Shapes
```mflow
// Example 1: Basic Shapes
circle at (150, 150) size 60 color #00FFFF
rect at (350, 150) width 100 height 100 color #FF00FF
triangle (250, 300) (200, 400) (300, 400) color #FFFF00
line (100, 450) (400, 450) color #FFFFFF
```

### Example 2: Animated Circle
```mflow
// Example 2: Rotating Animation
circle at (250, 250) size 80 color #00FFFF

animate {
  rotate 2
  scale 1.002
}
```

### Example 3: Time-Based Animation
```mflow
// Example 3: Time-Based Motion
let angle = time() * 2
let x = 250 + cos(angle) * 100
let y = 250 + sin(angle) * 100
circle at (x, y) size 50 color #FF0000
```

### Example 4: Mouse Interaction
```mflow
// Example 4: Mouse Following
circle at (mouseX, mouseY) size 30 color #00FFFF
```

### Example 5: Generative Pattern
```mflow
// Example 5: Generative Pattern
let angle = 0
repeat 12 {
  let x = 250 + cos(radians(angle)) * 150
  let y = 250 + sin(radians(angle)) * 150
  circle at (x, y) size 30 color #00FFFF
  let angle = angle + 30
}
```

### Example 6: Functions
```mflow
// Example 6: Function Usage
fn drawStar(x, y, color) {
  circle at (x, y) size 30 color color
  circle at (x, y) size 20 color #FFFFFF
}

drawStar(150, 150, #00FFFF)
drawStar(350, 150, #FF00FF)
drawStar(250, 350, #FFFF00)
```

### Example 7: Conditional Art
```mflow
// Example 7: Conditional Logic
let x = 50
repeat 10 {
  if x > 250 {
    circle at (x, 200) size 30 color #FF0000
  } else {
    circle at (x, 200) size 30 color #0000FF
  }
  let x = x + 50
}
```

### Example 8: Advanced Animation
```mflow
// Example 8: Complex Animation
circle at (250, 250) size 60 color #F5A623

animate {
  orbit 250 250 100 2
  pulse 0.8 1.2 1.0
  wobble 5 2
}
```

## 🛠️ Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Development Workflow

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

### Using the Compiler Programmatically

```typescript
import { MFlowCompiler } from './src/compiler';

const compiler = new MFlowCompiler();
const sourceCode = `
  circle at (250, 250) size 50 color #FF0000
  animate {
    rotate 2
  }
`;

const result = compiler.compile(sourceCode);

if (result.success) {
  console.log(result.output); // Generated JavaScript
} else {
  console.error(result.errors); // Compilation errors
}
```

### Testing

Check the `examples/` directory for example programs. Each example demonstrates different language features.

## 📦 Deployment

### Vercel Deployment

MFlow is ready for Vercel deployment:

```bash
# Build the project
npm run build

# Deploy to Vercel
vercel
```

The `vercel.json` configuration handles SPA routing automatically.

### Static Hosting

After building, the `dist/` folder contains static files that can be hosted anywhere:
- Netlify
- GitHub Pages
- AWS S3
- Any static hosting service

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Report Bugs** - Open an issue describing the bug
2. **Suggest Features** - Share your ideas for new features
3. **Submit Pull Requests** - Improvements and fixes are always appreciated
4. **Improve Documentation** - Help make the docs better

### Development Guidelines

- Follow TypeScript best practices
- Maintain code style consistency
- Add comments for complex logic
- Test your changes with examples
- Update documentation as needed

## 📄 License

MIT License - feel free to use MFlow in your projects.

See [LICENSE](./LICENSE) file for details.

## 🙏 Acknowledgments

- **Original Creator**: Mehdi - Built MFlow from scratch as a complete compiler project
- **Enhanced Version**: Added 20+ new features for enhanced creative coding capabilities
- **Community**: Thanks to all contributors and users

## 📚 Additional Resources

- [Language Specification](./docs/LANGUAGE_SPEC.md) - Detailed language syntax
- [Compiler Architecture](./docs/COMPILER_ARCHITECTURE.md) - Compiler design details
- [Examples](./examples/) - Example programs demonstrating features

## 🎯 Project Goals

MFlow aims to:

- **Simplify Creative Coding** - Make visual programming accessible to everyone
- **Provide Powerful Tools** - Rich set of features for complex projects
- **Enable Rapid Prototyping** - Quick iteration for creative ideas
- **Foster Learning** - Help people learn programming through visual art
- **Build Community** - Connect artists and coders

---

**MFlow** - *Where creativity meets computation*
