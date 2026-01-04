# MFlow Language Specification

**Version 1.0 - Created by Mehdi**

## Introduction

MFlow is a domain-specific programming language designed for creative coding, generative art, animations, and interactive visual programming. The language prioritizes expressiveness and simplicity while maintaining the power of a full compiled language.

## Lexical Structure

### Comments

```mflow
// Single-line comments start with //
```

### Identifiers

Identifiers must start with a letter or underscore, followed by any combination of letters, digits, or underscores.

```mflow
validName
_privateVar
myVar123
```

### Keywords

Reserved keywords in MFlow:

- `let` - Variable declaration
- `fn` - Function declaration
- `return` - Return statement
- `if` / `else` - Conditional statements
- `repeat` - Loop construct
- `animate` - Animation block
- `scene` - Scene definition
- `circle`, `rect`, `line`, `triangle` - Shape primitives
- `move`, `rotate`, `scale`, `fade` - Animation commands
- `up`, `down`, `left`, `right` - Direction keywords
- `at`, `size`, `width`, `height`, `color`, `speed` - Property keywords

### Literals

#### Numbers
```mflow
42
3.14159
0.5
```

#### Strings
```mflow
"Hello, MFlow!"
"A string with \"quotes\""
```

#### Colors
```mflow
#FF0000    // Red
#00FF00    // Green
#0000FF    // Blue
#FFFFFF    // White
#000000    // Black
```

### Operators

#### Arithmetic
```mflow
+  // Addition
-  // Subtraction
*  // Multiplication
/  // Division
%  // Modulo
```

#### Comparison
```mflow
==  // Equal
!=  // Not equal
<   // Less than
>   // Greater than
<=  // Less than or equal
>=  // Greater than or equal
```

#### Assignment
```mflow
=  // Assignment
```

## Syntax

### Variables

Variables are declared with the `let` keyword:

```mflow
let x = 100
let name = "MFlow"
let color = #FF00FF
```

### Functions

Functions are declared with the `fn` keyword:

```mflow
fn functionName(param1, param2) {
  // function body
  return value
}
```

Example:
```mflow
fn drawCircle(x, y, size) {
  circle at (x, y) size size color #00FFFF
}
```

### Conditionals

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
  circle at (x, 200) size 50 color #00FFFF
} else {
  rect at (x, 200) width 50 height 50 color #FF00FF
}
```

### Loops

The `repeat` keyword creates a counted loop:

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

### Shapes

#### Circle

```mflow
circle at (x, y) size radius color #RRGGBB
```

Parameters:
- `at (x, y)` - Position (required)
- `size` - Radius (required)
- `color` - Color value (required)

#### Rectangle

```mflow
rect at (x, y) width w height h color #RRGGBB
```

Parameters:
- `at (x, y)` - Position (required)
- `width` - Width (required)
- `height` - Height (required)
- `color` - Color value (required)

#### Line

```mflow
line (x1, y1) (x2, y2) color #RRGGBB
```

Parameters:
- `(x1, y1)` - Start point (required)
- `(x2, y2)` - End point (required)
- `color` - Color value (required)

#### Triangle

```mflow
triangle (x1, y1) (x2, y2) (x3, y3) color #RRGGBB
```

Parameters:
- Three points defining the triangle vertices (required)
- `color` - Color value (required)

### Animation

Animation blocks define continuous transformations:

```mflow
animate {
  // animation commands
}
```

#### Move Command

```mflow
move amount direction
```

Directions: `up`, `down`, `left`, `right`

Example:
```mflow
animate {
  move 2 right
  move 1 up
}
```

#### Rotate Command

```mflow
rotate angle
```

Angle in degrees.

Example:
```mflow
animate {
  rotate 5
}
```

#### Scale Command

```mflow
scale factor
```

Factor is a multiplier (1.0 = no change).

Example:
```mflow
animate {
  scale 1.01  // Grow by 1% per frame
}
```

#### Fade Command

```mflow
fade amount
```

Amount to decrease opacity.

Example:
```mflow
animate {
  fade 0.01
}
```

### Scenes

Scenes group related shapes and animations:

```mflow
scene sceneName {
  // scene content
}
```

Example:
```mflow
scene intro {
  circle at (250, 250) size 100 color #00FFFF
  
  animate {
    rotate 2
  }
}
```

## Type System

MFlow is dynamically typed with the following types:

- **Number**: Integer and floating-point values
- **String**: Text values
- **Color**: Hex color codes
- **Function**: Callable functions

## Execution Model

1. MFlow source code is compiled to JavaScript
2. Generated code uses HTML5 Canvas API for rendering
3. Animation blocks create `requestAnimationFrame` loops
4. Transform state is maintained and applied to shapes

## Scoping Rules

- Variables are function-scoped
- Functions can be called before their declaration (hoisting)
- Nested scopes can access outer scope variables
- Scene blocks create isolated scopes

## Best Practices

1. **Use descriptive names**: `circleRadius` instead of `r`
2. **Group related code in scenes**: Organize complex visuals
3. **Extract repeated patterns**: Use functions for reusable shapes
4. **Keep animations simple**: Complex animations should use multiple simple commands
5. **Comment your art**: Explain the creative intent

## Examples

### Minimal Program

```mflow
circle at (250, 250) size 50 color #00FFFF
```

### Function Usage

```mflow
fn star(x, y) {
  circle at (x, y) size 30 color #FFFF00
  circle at (x, y) size 15 color #FFFFFF
}

star(250, 250)
```

### Pattern Generation

```mflow
let angle = 0
repeat 8 {
  circle at (250, 150) size 30 color #00FFFF
  let angle = angle + 45
}
```

### Animated Scene

```mflow
scene rotating {
  rect at (250, 250) width 100 height 100 color #FF00FF
  
  animate {
    rotate 2
    scale 1.002
  }
}
```

## Error Handling

The compiler reports errors at three levels:

1. **Lexical errors**: Invalid characters or malformed tokens
2. **Syntax errors**: Incorrect language structure
3. **Semantic errors**: Undefined variables or type mismatches

All errors include line and column information for debugging.

---

**MFlow Language Specification v1.0**  
*Created by Mehdi for creative coders everywhere*
