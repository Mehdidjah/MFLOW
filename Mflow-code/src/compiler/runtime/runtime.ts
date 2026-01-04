// MFlow Runtime Library
// Provides built-in functions and utilities for compiled MFlow code

export const MFLOW_RUNTIME = `
// MFlow Runtime Library
(function() {
  'use strict';
  
  // Global state
  const mflow = {
    mouseX: 0,
    mouseY: 0,
    time: 0,
    frameCount: 0,
    keys: {},
    canvas: null,
    ctx: null,
  };
  
  // Math functions
  const math = {
    sin: Math.sin,
    cos: Math.cos,
    tan: Math.tan,
    asin: Math.asin,
    acos: Math.acos,
    atan: Math.atan,
    atan2: Math.atan2,
    sqrt: Math.sqrt,
    pow: Math.pow,
    abs: Math.abs,
    floor: Math.floor,
    ceil: Math.ceil,
    round: Math.round,
    min: Math.min,
    max: Math.max,
    random: function(min, max) {
      if (max === undefined) {
        max = min;
        min = 0;
      }
      return Math.random() * (max - min) + min;
    },
    noise: function(x, y, z) {
      // Simple Perlin-like noise (simplified implementation)
      const n = x * 12.9898 + y * 78.233 + (z || 0) * 37.719;
      return ((Math.sin(n) * 43758.5453123) % 1 + 1) / 2;
    },
    PI: Math.PI,
    TWO_PI: Math.PI * 2,
    HALF_PI: Math.PI / 2,
    lerp: function(a, b, t) {
      return a + (b - a) * t;
    },
    map: function(value, start1, stop1, start2, stop2) {
      return start2 + (stop2 - start2) * ((value - start1) / (stop1 - start1));
    },
    constrain: function(value, min, max) {
      return Math.min(Math.max(value, min), max);
    },
    dist: function(x1, y1, x2, y2) {
      return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    },
    radians: function(degrees) {
      return degrees * Math.PI / 180;
    },
    degrees: function(radians) {
      return radians * 180 / Math.PI;
    },
  };
  
  // Color utilities
  const color = {
    rgb: function(r, g, b) {
      return 'rgb(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ')';
    },
    rgba: function(r, g, b, a) {
      return 'rgba(' + Math.round(r) + ',' + Math.round(g) + ',' + Math.round(b) + ',' + a + ')';
    },
    hsl: function(h, s, l) {
      return 'hsl(' + h + ',' + s + '%,' + l + '%)';
    },
    hsla: function(h, s, l, a) {
      return 'hsla(' + h + ',' + s + '%,' + l + '%,' + a + ')';
    },
    lerpColor: function(c1, c2, t) {
      // Simple color interpolation (hex to rgb conversion needed)
      return c1; // Simplified
    },
  };
  
  // Array utilities
  const array = {
    length: function(arr) {
      return arr.length;
    },
    push: function(arr, ...items) {
      return arr.push(...items);
    },
    pop: function(arr) {
      return arr.pop();
    },
    shift: function(arr) {
      return arr.shift();
    },
    unshift: function(arr, ...items) {
      return arr.unshift(...items);
    },
    slice: function(arr, start, end) {
      return arr.slice(start, end);
    },
    concat: function(arr1, arr2) {
      return arr1.concat(arr2);
    },
    join: function(arr, separator) {
      return arr.join(separator);
    },
  };
  
  // Gradient utilities
  function createLinearGradient(x0, y0, x1, y1) {
    const gradient = mflow.ctx.createLinearGradient(x0, y0, x1, y1);
    return gradient;
  }
  
  function createRadialGradient(x0, y0, r0, x1, y1, r1) {
    const gradient = mflow.ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);
    return gradient;
  }
  
  // Filter utilities
  function applyFilter(filterType, value) {
    const oldFilter = mflow.ctx.filter;
    switch(filterType) {
      case 'blur':
        mflow.ctx.filter = 'blur(' + value + 'px)';
        break;
      case 'brightness':
        mflow.ctx.filter = 'brightness(' + value + ')';
        break;
      case 'contrast':
        mflow.ctx.filter = 'contrast(' + value + ')';
        break;
      case 'saturate':
        mflow.ctx.filter = 'saturate(' + value + ')';
        break;
      case 'grayscale':
        mflow.ctx.filter = 'grayscale(' + value + ')';
        break;
      default:
        mflow.ctx.filter = oldFilter;
    }
    return oldFilter;
  }
  
  // Image loading
  function loadImage(src) {
    return new Promise(function(resolve, reject) {
      const img = new Image();
      img.onload = function() {
        resolve(img);
      };
      img.onerror = reject;
      img.src = src;
    });
  }
  
  // Animation helpers
  function bounce(value, min, max, damping) {
    damping = damping || 0.8;
    if (value < min) {
      return min + (min - value) * damping;
    } else if (value > max) {
      return max - (value - max) * damping;
    }
    return value;
  }
  
  function wave(amplitude, frequency, offset) {
    offset = offset || 0;
    return Math.sin(mflow.time * frequency + offset) * amplitude;
  }
  
  function orbit(centerX, centerY, radius, speed, offset) {
    offset = offset || 0;
    const angle = mflow.time * speed + offset;
    return {
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
    };
  }
  
  function pulse(min, max, speed) {
    speed = speed || 1;
    const t = (Math.sin(mflow.time * speed) + 1) / 2;
    return min + (max - min) * t;
  }
  
  function wobble(amount, speed) {
    speed = speed || 1;
    return Math.sin(mflow.time * speed) * amount;
  }
  
  function spring(current, target, stiffness, damping) {
    stiffness = stiffness || 0.1;
    damping = damping || 0.9;
    const velocity = (target - current) * stiffness;
    return current + velocity * damping;
  }
  
  // Export to global scope
  window.mflow = mflow;
  window.Math = Object.assign(Math, math);
  window.sin = math.sin;
  window.cos = math.cos;
  window.tan = math.tan;
  window.sqrt = math.sqrt;
  window.pow = math.pow;
  window.abs = math.abs;
  window.floor = math.floor;
  window.ceil = math.ceil;
  window.round = math.round;
  window.random = math.random;
  window.noise = math.noise;
  window.PI = math.PI;
  window.TWO_PI = math.TWO_PI;
  window.createLinearGradient = createLinearGradient;
  window.createRadialGradient = createRadialGradient;
  window.applyFilter = applyFilter;
  window.loadImage = loadImage;
  window.bounce = bounce;
  window.wave = wave;
  window.orbit = orbit;
  window.pulse = pulse;
  window.wobble = wobble;
  window.spring = spring;
  window.mouseX = function() { return mflow.mouseX; };
  window.mouseY = function() { return mflow.mouseY; };
  window.time = function() { return mflow.time; };
  window.frameCount = function() { return mflow.frameCount; };
  
  // Initialize mouse tracking
  document.addEventListener('mousemove', function(e) {
    const rect = mflow.canvas.getBoundingClientRect();
    mflow.mouseX = e.clientX - rect.left;
    mflow.mouseY = e.clientY - rect.top;
  });
  
  // Initialize keyboard tracking
  document.addEventListener('keydown', function(e) {
    mflow.keys[e.key] = true;
  });
  
  document.addEventListener('keyup', function(e) {
    mflow.keys[e.key] = false;
  });
  
  // Animation frame counter
  function updateTime() {
    mflow.time += 0.016; // ~60fps
    mflow.frameCount++;
    requestAnimationFrame(updateTime);
  }
  updateTime();
})();
`;

