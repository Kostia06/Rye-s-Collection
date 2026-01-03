# GSAP Animation System Guide

Complete animation system for premium, cinematic web experiences.

## Philosophy

**Intentional, not flashy**
- Every animation serves a purpose
- Overlapping timelines, never linear sequences
- Subtle, expensive-feeling
- Performance-first (60fps, transform + opacity only)
- Accessibility respected (prefers-reduced-motion)

## Quick Start

```js
import { useGSAP, createHeroAnimation, staggerFadeIn } from '@/lib/animations';

function MyComponent() {
  const headlineRef = useRef(null);

  useGSAP(() => {
    createHeroAnimation({
      headline: headlineRef.current,
    });
  }, []);

  return <h1 ref={headlineRef}>Hello World</h1>;
}
```

## Core Concepts

### 1. Use Timelines, Not Isolated Tweens

**WHY**: Timelines allow complex sequencing and precise control over overlaps.

```js
// ❌ BAD: Isolated tweens
gsap.to(el1, { opacity: 1 });
gsap.to(el2, { opacity: 1, delay: 0.5 });

// ✅ GOOD: Timeline with overlaps
const tl = createTimeline();
tl.to(el1, { opacity: 1 })
  .to(el2, { opacity: 1 }, '-=0.3'); // Start 0.3s before previous completes
```

### 2. Transform + Opacity Only

**WHY**: GPU-accelerated properties = 60fps. Other properties cause reflows.

```js
// ✅ GOOD: GPU properties
gsap.to(el, { x: 100, y: 50, scale: 1.2, opacity: 1 });

// ❌ BAD: Layout properties (causes reflow)
gsap.to(el, { left: 100, top: 50, width: 300 });
```

### 3. Realistic Easing

**WHY**: Default easings feel robotic. Power curves feel premium.

```js
import { EASINGS } from '@/lib/animations';

// Available easings
EASINGS.smooth      // power3.out - most UI
EASINGS.snappy      // power4.out - micro-interactions
EASINGS.cinematic   // expo.out - hero sections
EASINGS.elastic     // back.out - playful (use sparingly)
```

### 4. Overlapping, Not Sequential

**WHY**: Overlaps create fluid motion. Sequential feels mechanical.

```js
// ✅ GOOD: Overlapping sequence
tl.to(headline, { y: 0, opacity: 1 })
  .to(subtitle, { y: 0, opacity: 1 }, '-=0.6')  // Overlap
  .to(cta, { scale: 1, opacity: 1 }, '-=0.4');  // Overlap

// ❌ BAD: Linear sequence
tl.to(headline, { y: 0, opacity: 1 })
  .to(subtitle, { y: 0, opacity: 1 })  // Waits for headline
  .to(cta, { scale: 1, opacity: 1 });  // Waits for subtitle
```

## Animation Categories

### Hero Animations

Premium landing page entrances. Cinematic timing.

```js
import { createHeroAnimation } from '@/lib/animations';

useGSAP(() => {
  createHeroAnimation({
    headline: headlineRef.current,
    subtitle: subtitleRef.current,
    cta: ctaRef.current,
    decorations: [icon1Ref.current, icon2Ref.current],
  });
}, []);
```

**When to use**: Landing pages, major section intros
**When NOT to use**: Every page header

### Scroll Reveals

Elements reveal as they enter viewport.

```js
import { createScrollReveal } from '@/lib/animations';

useGSAP(() => {
  createScrollReveal(
    sectionRef.current,  // Trigger element
    childrenRefs.current, // Elements to animate
    {
      start: 'top 80%',  // When section is 80% down viewport
      stagger: 0.1,
      y: 40,
    }
  );
}, []);
```

**When to use**: Important content sections
**When NOT to use**: Every section (ruins the effect)

### GSAP Flip (Layout Transitions)

Seamless transitions when layout changes.

```js
import { animateLayoutChange } from '@/lib/animations';

const handleViewChange = () => {
  animateLayoutChange(gridRef.current, () => {
    setView('list'); // Change that affects layout
  }, {
    duration: 0.8,
    stagger: 0.05,
  });
};
```

**When to use**: Grid ↔ list views, reordering, responsive changes
**Why it's magic**: DOM changes instantly, but looks smooth

### Micro-Interactions

Tactile feedback for high-importance elements only.

```js
import { buttonPress, successFeedback } from '@/lib/animations';

// Button press
const handleClick = () => {
  buttonPress(buttonRef.current);
};

// Success feedback
const handleLike = () => {
  successFeedback(iconRef.current);
};
```

**When to use**: Primary CTAs, critical feedback
**When NOT to use**: Every button, decorative elements

### SVG Animations

Line drawing, path reveals.

```js
import { drawSVGPath } from '@/lib/animations';

useGSAP(() => {
  const paths = svgRef.current.querySelectorAll('path');
  paths.forEach((path, i) => {
    drawSVGPath(path, {
      duration: 1.5,
      delay: i * 0.2,
    });
  });
}, []);
```

**Requirements**: SVG must have stroke defined

## Component Examples

### Animated Hero

```js
import AnimatedHero from '@/components/AnimatedHero';

<AnimatedHero
  headline="My Collection"
  subtitle="A beautiful showcase"
  showCTA
  ctaText="Explore"
  onCTAClick={handleExplore}
/>
```

### Animated Section

```js
import AnimatedSection from '@/components/AnimatedSection';

<AnimatedSection className="py-12">
  <h2>Features</h2>
  <div>Content reveals on scroll</div>
</AnimatedSection>
```

### Animated Grid

```js
import AnimatedGrid from '@/components/AnimatedGrid';

<AnimatedGrid
  items={items}
  columns={3}
  renderItem={(item) => <Card {...item} />}
  onItemClick={handleItemClick}
/>
```

### Animated Button

```js
import AnimatedButton from '@/components/AnimatedButton';

// Standard button
<AnimatedButton onClick={handleClick}>
  Click Me
</AnimatedButton>

// Hero CTA with magnetic effect
<AnimatedButton magnetic onClick={handleCTA}>
  Get Started
</AnimatedButton>
```

## Performance Rules

### ✅ DO

- Animate transform and opacity only
- Use timelines for sequences
- Limit staggered items to ≤20 per timeline
- Clean up in useEffect/useLayoutEffect return
- Respect prefers-reduced-motion

### ❌ DON'T

- Animate width, height, top, left (causes reflow)
- Create new animations on every render
- Forget to kill ScrollTriggers on unmount
- Use animations without purpose
- Over-animate (kills the premium feel)

## Accessibility

All animations respect `prefers-reduced-motion`. System automatically handles this.

```js
import { animateWithReducedMotion } from '@/lib/animations';

useGSAP(() => {
  animateWithReducedMotion(() => {
    return createHeroAnimation({ ... });
  });
}, []);
```

## Common Patterns

### Stagger Reveal

```js
import { staggerFadeIn } from '@/lib/animations';

useGSAP(() => {
  staggerFadeIn(itemRefs.current, {
    stagger: 0.05,
    y: 30,
  });
}, [items.length]);
```

### Parallax Background

```js
import { createParallax } from '@/lib/animations';

useGSAP(() => {
  createParallax(backgroundRef.current, {
    speed: 0.5, // Half scroll speed
  });
}, []);
```

### Count Up Animation

```js
import { countUp } from '@/lib/animations';

useGSAP(() => {
  countUp(numberRef.current, 1234, {
    duration: 2,
    decimals: 0,
  });
}, []);
```

## Debugging

Enable ScrollTrigger markers for debugging:

```js
createScrollReveal(trigger, targets, {
  markers: true,  // Shows visual markers
});
```

## When NOT to Animate

Animation is a tool, not a requirement. Skip animations for:

- Every single UI element
- Purely functional interfaces (dashboards, forms)
- Elements that update frequently
- Low-importance content
- When it would slow interaction

**Remember**: Restraint creates impact. Over-animation = cheap feeling.

## Architecture

```
src/
├── lib/
│   └── animations/
│       ├── core.js              # Config, utilities
│       ├── hero.js              # Hero animations
│       ├── scroll.js            # ScrollTrigger
│       ├── pageTransitions.js   # Route transitions
│       ├── svg.js               # SVG animations
│       ├── flip.js              # Layout transitions
│       ├── microInteractions.js # UI feedback
│       └── index.js             # Exports
├── hooks/
│   └── useGSAP.js               # Custom React hook
└── components/
    ├── AnimatedHero.js          # Hero component
    ├── AnimatedSection.js       # Scroll section
    ├── AnimatedGrid.js          # Grid with reveals
    └── AnimatedButton.js        # Interactive button
```

## Next Steps

1. Import animation system: `import { ... } from '@/lib/animations'`
2. Use `useGSAP` hook for component animations
3. Start with hero section (biggest impact)
4. Add scroll reveals to key sections
5. Add micro-interactions to primary CTAs
6. Test with `prefers-reduced-motion` enabled

---

**Questions?** Check the source code comments - every function explains WHY it exists, not just HOW to use it.
