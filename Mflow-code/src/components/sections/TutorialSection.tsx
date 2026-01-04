import { useState } from 'react';
import { ChevronRight, Check, Circle } from 'lucide-react';

const TUTORIALS = [
  {
    id: 1,
    title: 'Getting Started',
    description: 'Learn the basics of MFlow syntax',
    steps: [
      {
        title: 'Your First Shape',
        content: 'MFlow makes drawing shapes simple. Use the shape name followed by position and properties.',
        code: `// Draw a circle at position (100, 100) with size 50
circle at (100, 100) size 50 color #F5A623`,
        explanation: 'The `at` keyword sets the position, `size` defines the radius, and `color` sets the fill color.'
      },
      {
        title: 'Multiple Shapes',
        content: 'You can draw multiple shapes by adding more lines.',
        code: `circle at (100, 150) size 40 color #F5A623
rect at (250, 150) width 80 height 60 color #E67E22
triangle (400, 100) (350, 200) (450, 200) color #D35400`,
        explanation: 'Each shape has its own syntax. Rectangles use `width` and `height`, triangles use three coordinate pairs.'
      },
      {
        title: 'Using Variables',
        content: 'Variables help you reuse values and create dynamic art.',
        code: `let centerX = 250
let centerY = 200
let radius = 60

circle at (centerX, centerY) size radius color #F5A623`,
        explanation: 'Use `let` to declare variables. They can store numbers and be used anywhere.'
      }
    ]
  },
  {
    id: 2,
    title: 'Animation Basics',
    description: 'Bring your art to life with animations',
    steps: [
      {
        title: 'The Animate Block',
        content: 'Wrap motion commands in an `animate` block to create movement.',
        code: `circle at (50, 200) size 40 color #F5A623

animate {
  move 2 right
}`,
        explanation: 'The animate block applies continuous motion. `move 2 right` moves 2 pixels right each frame.'
      },
      {
        title: 'Rotation',
        content: 'Add rotation to create spinning effects.',
        code: `rect at (250, 200) width 80 height 80 color #E67E22

animate {
  rotate 3
}`,
        explanation: '`rotate 3` rotates the shape 3 degrees per frame. Negative values rotate counter-clockwise.'
      },
      {
        title: 'Combined Effects',
        content: 'Combine multiple animations for complex effects.',
        code: `circle at (100, 200) size 50 color #F5A623

animate {
  move 1 right
  rotate 2
  pulse 0.3
}`,
        explanation: 'Multiple commands in animate block are applied together. `pulse` creates a breathing scale effect.'
      }
    ]
  },
  {
    id: 3,
    title: 'Loops & Patterns',
    description: 'Create generative patterns with loops',
    steps: [
      {
        title: 'The Repeat Block',
        content: 'Use `repeat` to draw multiple shapes efficiently.',
        code: `repeat 5 {
  circle at (250, 200) size 30 color #F5A623
}`,
        explanation: 'This draws 5 circles. Combined with variables, you can create complex patterns.'
      },
      {
        title: 'Dynamic Patterns',
        content: 'Use variables inside loops for procedural generation.',
        code: `let x = 50
repeat 5 {
  circle at (x, 200) size 25 color #F5A623
  let x = x + 80
}`,
        explanation: 'By incrementing `x` each iteration, circles are spaced evenly across the canvas.'
      },
      {
        title: 'Radial Patterns',
        content: 'Create circular arrangements using math.',
        code: `let i = 0
repeat 8 {
  let angle = i * 45
  circle at (250, 200) size 20 color #F5A623
  animate {
    orbit angle distance 80
  }
  let i = i + 1
}`,
        explanation: 'The `orbit` command positions shapes in a circle around a center point.'
      }
    ]
  },
  {
    id: 4,
    title: 'Scenes & Layers',
    description: 'Organize complex compositions',
    steps: [
      {
        title: 'Creating Scenes',
        content: 'Scenes group related shapes and provide layering.',
        code: `scene background {
  rect at (250, 250) width 500 height 500 color #1A1512
}

scene shapes {
  circle at (250, 200) size 50 color #F5A623
}`,
        explanation: 'Scenes render in order. Use them to separate background, midground, and foreground.'
      },
      {
        title: 'Scene Animations',
        content: 'Animate entire scenes together.',
        code: `scene particles {
  repeat 10 {
    circle at (250, 250) size 10 color #F5A623
    animate {
      explode random speed 1
      fade 0.01
    }
  }
}`,
        explanation: 'All shapes in a scene can share animation properties.'
      }
    ]
  }
];

const TutorialSection = () => {
  const [activeTutorial, setActiveTutorial] = useState(0);
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<Set<string>>(new Set());

  const currentTutorial = TUTORIALS[activeTutorial];
  const currentStep = currentTutorial.steps[activeStep];

  const markComplete = () => {
    const key = `${activeTutorial}-${activeStep}`;
    setCompletedSteps(new Set([...completedSteps, key]));
    
    if (activeStep < currentTutorial.steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else if (activeTutorial < TUTORIALS.length - 1) {
      setActiveTutorial(activeTutorial + 1);
      setActiveStep(0);
    }
  };

  const isStepComplete = (tutIdx: number, stepIdx: number) => 
    completedSteps.has(`${tutIdx}-${stepIdx}`);

  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Tutorial</h2>
          <p className="text-muted-foreground">Learn MFlow step by step</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* Tutorial Navigation */}
          <div className="lg:col-span-4 space-y-2">
            {TUTORIALS.map((tutorial, tutIdx) => (
              <div key={tutorial.id} className="glass-card overflow-hidden">
                <button
                  onClick={() => {
                    setActiveTutorial(tutIdx);
                    setActiveStep(0);
                  }}
                  className={`w-full p-4 text-left transition-colors ${
                    activeTutorial === tutIdx ? 'bg-primary/10' : 'hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-medium ${activeTutorial === tutIdx ? 'text-primary' : ''}`}>
                      {tutorial.title}
                    </h3>
                    <ChevronRight className={`w-4 h-4 transition-transform ${activeTutorial === tutIdx ? 'rotate-90 text-primary' : 'text-muted-foreground'}`} />
                  </div>
                  <p className="text-sm text-muted-foreground">{tutorial.description}</p>
                </button>

                {activeTutorial === tutIdx && (
                  <div className="border-t border-border px-4 py-2 space-y-1">
                    {tutorial.steps.map((step, stepIdx) => (
                      <button
                        key={stepIdx}
                        onClick={() => setActiveStep(stepIdx)}
                        className={`w-full flex items-center gap-2 px-2 py-1.5 rounded text-sm transition-colors ${
                          activeStep === stepIdx
                            ? 'text-primary bg-primary/10'
                            : 'text-muted-foreground hover:text-foreground'
                        }`}
                      >
                        {isStepComplete(tutIdx, stepIdx) ? (
                          <Check className="w-4 h-4 text-success" />
                        ) : (
                          <Circle className="w-4 h-4" />
                        )}
                        {step.title}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Tutorial Content */}
          <div className="lg:col-span-8">
            <div className="glass-card p-6">
              <div className="mb-6">
                <span className="text-sm text-primary font-medium">
                  Step {activeStep + 1} of {currentTutorial.steps.length}
                </span>
                <h3 className="text-xl font-semibold mt-1">{currentStep.title}</h3>
                <p className="text-muted-foreground mt-2">{currentStep.content}</p>
              </div>

              {/* Code Example */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-muted-foreground">Example</span>
                </div>
                <pre className="bg-code-bg border border-code-border rounded-lg p-4 overflow-x-auto">
                  <code className="font-mono text-sm">{currentStep.code}</code>
                </pre>
              </div>

              {/* Explanation */}
              <div className="bg-muted/30 border border-border rounded-lg p-4 mb-6">
                <h4 className="text-sm font-medium mb-2 text-primary">Explanation</h4>
                <p className="text-sm text-muted-foreground">{currentStep.explanation}</p>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  onClick={() => activeStep > 0 && setActiveStep(activeStep - 1)}
                  disabled={activeStep === 0}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={markComplete}
                  className="px-6 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors"
                >
                  {activeStep < currentTutorial.steps.length - 1 ? 'Mark Complete & Next' : 
                   activeTutorial < TUTORIALS.length - 1 ? 'Next Tutorial' : 'Complete'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TutorialSection;
