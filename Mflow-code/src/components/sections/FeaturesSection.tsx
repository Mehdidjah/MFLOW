const FEATURES = [
  {
    title: 'Particle Systems',
    description: 'Create stunning particle effects with explode, scatter, and emit commands. Perfect for fireworks, snow, and magic effects.',
    code: `animate { explode 45 speed 3 }`,
    badge: 'New'
  },
  {
    title: 'Wave Motion',
    description: 'Add organic wave animations using sine-wave based movement. Create flowing, natural motion patterns.',
    code: `animate { wave amplitude 20 frequency 0.5 }`,
    badge: 'New'
  },
  {
    title: 'Bounce Physics',
    description: 'Realistic bounce animations with customizable dampening. Shapes bounce off canvas edges naturally.',
    code: `animate { bounce dampen 0.8 }`,
    badge: 'New'
  },
  {
    title: 'Orbit System',
    description: 'Create circular motion paths around center points. Build planetary systems and rotating patterns.',
    code: `animate { orbit angle 45 distance 100 }`,
    badge: 'New'
  },
  {
    title: 'Color Transitions',
    description: 'Smooth color animations and gradients. Cycle through colors or blend between them over time.',
    code: `animate { colorShift from #F5A623 to #E67E22 }`,
    badge: 'New'
  },
  {
    title: 'Glow Effects',
    description: 'Add radiant glow effects to any shape. Create neon lights, fire, and luminescent art.',
    code: `circle glow intensity 15 color #F5A623`,
    badge: 'New'
  },
  {
    title: 'Scene Management',
    description: 'Organize complex compositions with named scenes. Layer backgrounds, midgrounds, and foregrounds.',
    code: `scene background { ... }`
  },
  {
    title: 'Motion Paths',
    description: 'Define custom movement paths for shapes. Create bezier curves and complex trajectories.',
    code: `animate { path bezier (0,0) (100,50) (200,0) }`,
    badge: 'New'
  },
  {
    title: 'Speed Control',
    description: 'Fine-tune animation timing with speed multipliers. Create slow-motion or fast-forward effects.',
    code: `animate speed 0.5 { ... }`
  },
  {
    title: 'Collision Detection',
    description: 'Built-in collision system for interactive art. Shapes can respond to touching boundaries or each other.',
    code: `animate { onCollide bounce }`,
    badge: 'New'
  }
];

const FeaturesSection = () => {
  return (
    <section className="py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-semibold mb-2">Features</h2>
          <p className="text-muted-foreground">10 powerful creative features to bring your art to life</p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {FEATURES.map((feature, index) => (
            <div
              key={index}
              className="glass-card-hover p-5 group flex flex-col"
            >
              {/* Badge */}
              {feature.badge && (
                <div className="flex justify-end mb-2">
                  <span className="badge text-xs">{feature.badge}</span>
                </div>
              )}

              {/* Title at top, bigger size */}
              <h3 className="font-bold text-xl sm:text-2xl mb-4 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              
              {/* Description */}
              <p className="text-sm text-muted-foreground mb-3 flex-1">
                {feature.description}
              </p>
              
              {/* Code */}
              <code className="text-xs bg-code-bg px-2 py-1 rounded text-primary/80 font-mono">
                {feature.code}
              </code>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;