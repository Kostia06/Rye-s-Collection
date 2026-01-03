# GSAP Animation System - Implementation Guide

Complete guide for integrating the premium GSAP animation system into your Next.js app.

## What's Been Built

A production-ready GSAP animation system with:

✅ **Core Animation Utilities** (`src/lib/animations/`)
- Consistent timing, easing, durations
- Timeline creation helpers
- Reduced motion support

✅ **Hero Animations** - Cinematic entrance sequences with overlapping timelines

✅ **Scroll Animations** - ScrollTrigger reveals, parallax, pinning

✅ **Page Transitions** - Smooth route changes with directional awareness

✅ **SVG Animations** - Line drawing, path reveals, morphing

✅ **GSAP Flip** - Seamless layout transitions (grid ↔ list, reordering)

✅ **Micro-Interactions** - Button presses, success feedback, magnetic buttons

✅ **React Hooks** - `useGSAP` for proper lifecycle management

✅ **Ready-to-Use Components**:
- `AnimatedHero` - Premium hero sections
- `AnimatedSection` - Scroll-reveal sections
- `AnimatedGrid` - Staggered grid reveals
- `AnimatedButton` - Interactive buttons with micro-animations

## Installation

GSAP is already installed. If you need to reinstall:

```bash
npm install gsap
```

## Quick Start (5 Minutes)

### Step 1: Replace Hero Section

Open `src/app/page.js` and replace the header section:

```jsx
// OLD (Framer Motion)
import { motion } from 'framer-motion';

<motion.div
  className="flex items-center justify-center gap-3"
  initial={{ scale: 0.5, opacity: 0 }}
  animate={{ scale: 1, opacity: 1 }}
>
  {/* ... */}
</motion.div>

// NEW (GSAP)
import AnimatedHero from '@/components/AnimatedHero';

<AnimatedHero
  headline="My Collection"
  subtitle="A beautiful showcase of treasured collectibles"
/>
```

### Step 2: Add Stagger Reveal to Controls

```jsx
import { useGSAP, useAnimationRefs } from '@/hooks/useGSAP';
import { staggerFadeIn } from '@/lib/animations';

function MyPage() {
  const { refs, setRef } = useAnimationRefs();

  useGSAP(() => {
    if (refs.current.length === 0) return;
    staggerFadeIn(refs.current, {
      stagger: 0.08,
      y: 20,
    });
  }, [refs.current.length]);

  return (
    <>
      <div ref={setRef(0)}><SearchBar /></div>
      <div ref={setRef(1)}><CategoryFilter /></div>
      <div ref={setRef(2)}><SortControl /></div>
    </>
  );
}
```

### Step 3: Add Animated Button

```jsx
import AnimatedButton from '@/components/AnimatedButton';

// Standard button with press animation
<AnimatedButton onClick={handleClick}>
  Click Me
</AnimatedButton>

// Hero CTA with magnetic effect
<AnimatedButton magnetic onClick={handleCTA}>
  Get Started
</AnimatedButton>
```

## Full Implementation

For a complete example, see `src/app/page-enhanced.js`.

### Replace Entire Page

1. **Backup current page**:
```bash
cp src/app/page.js src/app/page.backup.js
```

2. **Copy enhanced version**:
```bash
cp src/app/page-enhanced.js src/app/page.js
```

3. **Test the animations**:
```bash
npm run dev
```

### Replace CollectionGrid

1. **Backup**:
```bash
cp src/components/CollectionGrid.js src/components/CollectionGrid.backup.js
```

2. **Copy enhanced version**:
```bash
cp src/components/CollectionGrid.enhanced.js src/components/CollectionGrid.js
```

## Customization

### Adjust Timing

Edit `src/lib/animations/core.js`:

```js
export const DURATIONS = {
  instant: 0.2,
  fast: 0.4,
  normal: 0.8,     // ← Change this for slower/faster
  slow: 1.2,
  cinematic: 1.8,
};
```

### Change Easing

```js
export const EASINGS = {
  smooth: 'power3.out',      // ← Default easing
  snappy: 'power4.out',
  cinematic: 'expo.out',
  elastic: 'back.out(1.4)',
};
```

### Adjust Stagger

```js
export const STAGGERS = {
  tight: 0.05,
  normal: 0.1,     // ← Default stagger
  loose: 0.15,
};
```

## Advanced Usage

### Scroll-Triggered Sections

```jsx
import AnimatedSection from '@/components/AnimatedSection';

<AnimatedSection className="py-12">
  <h2>Features</h2>
  <p>This content reveals on scroll</p>
</AnimatedSection>
```

### Grid with Layout Transitions

```jsx
import { animateLayoutChange } from '@/lib/animations';

const handleViewChange = (newView) => {
  animateLayoutChange(gridRef.current, () => {
    setView(newView);
  });
};
```

### Custom Animation

```jsx
import { useGSAP } from '@/hooks/useGSAP';
import { createTimeline, EASINGS, DURATIONS } from '@/lib/animations';

function MyComponent() {
  const elementRef = useRef(null);

  useGSAP(() => {
    const tl = createTimeline();

    tl.to(elementRef.current, {
      x: 100,
      opacity: 1,
      duration: DURATIONS.normal,
      ease: EASINGS.smooth,
    });
  }, []);

  return <div ref={elementRef}>Animated Element</div>;
}
```

### SVG Line Drawing

```jsx
import { useGSAP } from '@/hooks/useGSAP';
import { drawSVGPath } from '@/lib/animations';

function Logo() {
  const svgRef = useRef(null);

  useGSAP(() => {
    const paths = svgRef.current.querySelectorAll('path');
    paths.forEach((path, i) => {
      drawSVGPath(path, {
        duration: 1.5,
        delay: i * 0.2,
      });
    });
  }, []);

  return (
    <svg ref={svgRef}>
      <path d="..." stroke="currentColor" fill="none" />
    </svg>
  );
}
```

## Performance Checklist

✅ **Only animate transform and opacity** - GPU accelerated
✅ **Use timelines** - Better control, cleaner code
✅ **Clean up on unmount** - useGSAP handles this automatically
✅ **Limit staggered items** - Keep under 20 per timeline
✅ **Test on mobile** - Ensure 60fps
✅ **Respect reduced motion** - System handles automatically

## Common Issues

### Animations not running?

1. Check component is client-side (`'use client'` directive)
2. Ensure refs are attached before animation runs
3. Verify useGSAP dependencies array

### Animations flickering?

- useGSAP uses `useLayoutEffect` internally (prevents flicker)
- Set initial states with `gsap.set()` before animating

### ScrollTrigger not working?

```jsx
import { killScrollTriggers } from '@/lib/animations';

useGSAP(() => {
  createScrollReveal(/* ... */);

  return () => {
    killScrollTriggers(triggerElement);
  };
}, []);
```

## Migration from Framer Motion

Replace these common patterns:

```jsx
// BEFORE (Framer Motion)
<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>

// AFTER (GSAP)
function Component() {
  const ref = useRef(null);

  useGSAP(() => {
    gsap.set(ref.current, { opacity: 0, y: 20 });
    gsap.to(ref.current, {
      opacity: 1,
      y: 0,
      duration: 0.5,
    });
  }, []);

  return <div ref={ref}>
}
```

Or use the helper:

```jsx
import { staggerFadeIn } from '@/lib/animations';

useGSAP(() => {
  staggerFadeIn(ref.current, { y: 20 });
}, []);
```

## File Structure

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
│
├── hooks/
│   └── useGSAP.js               # Custom hook
│
├── components/
│   ├── AnimatedHero.js          # Hero component
│   ├── AnimatedSection.js       # Scroll section
│   ├── AnimatedGrid.js          # Grid with reveals
│   ├── AnimatedButton.js        # Interactive button
│   ├── CollectionGrid.enhanced.js # Enhanced grid
│   └── ...
│
└── app/
    ├── page.js                  # Current page
    └── page-enhanced.js         # GSAP version
```

## Next Steps

1. ✅ Review `ANIMATION_GUIDE.md` for detailed API docs
2. ✅ Check `page-enhanced.js` for complete example
3. ✅ Gradually migrate components from Framer Motion to GSAP
4. ✅ Test with `prefers-reduced-motion` enabled
5. ✅ Measure performance with Chrome DevTools

## Support

- **API Documentation**: See `ANIMATION_GUIDE.md`
- **Examples**: Check `page-enhanced.js` and `src/components/Animated*.js`
- **GSAP Docs**: https://gsap.com/docs/

---

**Key Principle**: Less is more. Not every element needs animation. The best animations serve a purpose and feel intentional.
