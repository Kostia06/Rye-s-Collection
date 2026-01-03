# GSAP Animation System - Complete Package

A production-ready, premium animation system for Next.js with GSAP. Designed for cinematic, intentional motion that feels expensive and performs at 60fps.

## 🎯 What You Get

### Complete Animation Library

**Core Utilities** (`src/lib/animations/`)
- `core.js` - Timing, easing, timeline helpers
- `hero.js` - Premium landing page animations
- `scroll.js` - ScrollTrigger reveals, parallax, pinning
- `pageTransitions.js` - Route transitions
- `svg.js` - Line drawing, path animations
- `flip.js` - GSAP Flip for layout transitions
- `microInteractions.js` - Button feedback, success/error states

**React Integration**
- `useGSAP` hook - Proper React lifecycle management
- `useAnimationRef` / `useAnimationRefs` - Type-safe ref helpers
- Automatic cleanup on unmount
- Reduced motion support built-in

**Ready-to-Use Components**
- `AnimatedHero` - Hero sections with cinematic entrance
- `AnimatedSection` - Scroll-triggered section reveals
- `AnimatedGrid` - Staggered grid reveals
- `AnimatedButton` - Buttons with micro-interactions + magnetic effect

**Example Files**
- `page-enhanced.js` - Complete page implementation
- `CollectionGrid.enhanced.js` - Grid with GSAP animations
- `animation-demo/page.js` - Live showcase of all animations

**Documentation**
- `ANIMATION_GUIDE.md` - Complete API reference
- `IMPLEMENTATION_GUIDE.md` - Step-by-step integration
- `GSAP_SYSTEM_README.md` - This file

## 🚀 Quick Start

### 1. See It In Action

Visit the demo page:
```bash
npm run dev
# Navigate to http://localhost:3000/animation-demo
```

### 2. Use Ready-Made Components

```jsx
import AnimatedHero from '@/components/AnimatedHero';

<AnimatedHero
  headline="My Amazing Site"
  subtitle="Premium animations made simple"
  showCTA
  ctaText="Get Started"
/>
```

### 3. Custom Animations

```jsx
import { useGSAP } from '@/hooks/useGSAP';
import { createTimeline, EASINGS } from '@/lib/animations';

function MyComponent() {
  const elementRef = useRef(null);

  useGSAP(() => {
    const tl = createTimeline();
    tl.to(elementRef.current, {
      x: 100,
      opacity: 1,
      duration: 0.8,
      ease: EASINGS.smooth,
    });
  }, []);

  return <div ref={elementRef}>Animated!</div>;
}
```

## 📁 File Structure

```
src/
├── lib/animations/          # Core animation library
│   ├── core.js             # Timing, easing, utilities
│   ├── hero.js             # Hero animations
│   ├── scroll.js           # ScrollTrigger
│   ├── pageTransitions.js  # Route transitions
│   ├── svg.js              # SVG animations
│   ├── flip.js             # Layout transitions
│   ├── microInteractions.js # UI feedback
│   └── index.js            # Exports
│
├── hooks/
│   └── useGSAP.js          # React hook
│
├── components/
│   ├── AnimatedHero.js     # Hero component
│   ├── AnimatedSection.js  # Scroll section
│   ├── AnimatedGrid.js     # Grid component
│   ├── AnimatedButton.js   # Button component
│   └── CollectionGrid.enhanced.js
│
├── app/
│   ├── page-enhanced.js    # Example page
│   └── animation-demo/
│       └── page.js         # Demo page
│
└── [root]/
    ├── ANIMATION_GUIDE.md       # API docs
    ├── IMPLEMENTATION_GUIDE.md  # Integration guide
    └── GSAP_SYSTEM_README.md    # This file
```

## 🎨 Animation Types

### 1. Hero Animations
Cinematic entrance for landing pages. Overlapping timelines create fluid motion.

```jsx
import { createHeroAnimation } from '@/lib/animations';

createHeroAnimation({
  headline: headlineRef.current,
  subtitle: subtitleRef.current,
  cta: ctaRef.current,
  decorations: [icon1, icon2],
});
```

### 2. Scroll Reveals
Elements reveal as they enter viewport. Use sparingly for impact.

```jsx
import { createScrollReveal } from '@/lib/animations';

createScrollReveal(trigger, targets, {
  start: 'top 80%',
  stagger: 0.1,
  y: 40,
});
```

### 3. Layout Transitions (GSAP Flip)
Seamless transitions when layout changes (grid ↔ list, reordering).

```jsx
import { animateLayoutChange } from '@/lib/animations';

animateLayoutChange(container, () => {
  setView('list'); // Change that affects layout
});
```

### 4. Micro-Interactions
Tactile feedback for buttons and UI elements.

```jsx
import { buttonPress, successFeedback } from '@/lib/animations';

// Button press
buttonPress(buttonRef.current);

// Success animation
successFeedback(iconRef.current);
```

### 5. SVG Animations
Line drawing and path reveals for logos and icons.

```jsx
import { drawSVGPath } from '@/lib/animations';

drawSVGPath(pathElement, {
  duration: 1.5,
  delay: 0.2,
});
```

## ⚡ Performance Principles

### Transform + Opacity Only
GPU-accelerated properties for 60fps performance.

```jsx
// ✅ GOOD
gsap.to(el, { x: 100, y: 50, scale: 1.2, opacity: 1 });

// ❌ BAD (causes reflow)
gsap.to(el, { left: 100, top: 50, width: 300 });
```

### Use Timelines
Better control, cleaner sequencing, easier to maintain.

```jsx
// ✅ GOOD
const tl = createTimeline();
tl.to(el1, { opacity: 1 })
  .to(el2, { opacity: 1 }, '-=0.3'); // Overlap

// ❌ BAD
gsap.to(el1, { opacity: 1 });
gsap.to(el2, { opacity: 1, delay: 0.5 });
```

### Overlapping > Sequential
Overlaps create fluidity. Linear sequences feel robotic.

```jsx
tl.to(headline, { y: 0 })
  .to(subtitle, { y: 0 }, '-=0.6')  // Start 0.6s before previous completes
  .to(cta, { scale: 1 }, '-=0.4');  // Overlap again
```

### Automatic Cleanup
useGSAP hook handles cleanup automatically.

```jsx
useGSAP(() => {
  const tl = gsap.timeline();
  // Animation code...
  // Cleanup happens automatically on unmount
}, []);
```

## 🎯 Design Philosophy

### Intentional, Not Flashy
- Every animation serves a purpose
- Subtle, expensive-feeling motion
- Restraint creates impact
- Not every element needs animation

### Accessibility First
- Respects `prefers-reduced-motion`
- Instant transitions for users who need them
- Built-in, automatic

### Performance First
- 60fps on all devices
- GPU-accelerated properties only
- Efficient timelines
- Mobile-tested

## 📚 Documentation

### Quick Reference
- **API Docs**: `ANIMATION_GUIDE.md` - Complete function reference
- **Integration**: `IMPLEMENTATION_GUIDE.md` - Step-by-step setup
- **Examples**: `page-enhanced.js`, `animation-demo/page.js`

### Key Exports

```jsx
// Core
import {
  createTimeline,
  EASINGS,
  DURATIONS,
  STAGGERS,
} from '@/lib/animations';

// Hero
import {
  createHeroAnimation,
  createSimpleHeroAnimation,
} from '@/lib/animations';

// Scroll
import {
  createScrollReveal,
  createParallax,
  killScrollTriggers,
} from '@/lib/animations';

// Interactions
import {
  buttonPress,
  successFeedback,
  errorShake,
  staggerFadeIn,
} from '@/lib/animations';

// Flip
import {
  animateLayoutChange,
  gridToDetailTransition,
} from '@/lib/animations';

// Hooks
import {
  useGSAP,
  useAnimationRef,
  useAnimationRefs,
} from '@/hooks/useGSAP';
```

## 🛠️ Common Patterns

### Stagger Reveal

```jsx
import { staggerFadeIn } from '@/lib/animations';

useGSAP(() => {
  staggerFadeIn(itemRefs.current, {
    stagger: 0.05,
    y: 30,
  });
}, [items.length]);
```

### Scroll Section

```jsx
import AnimatedSection from '@/components/AnimatedSection';

<AnimatedSection className="py-12">
  <h2>Content reveals on scroll</h2>
</AnimatedSection>
```

### Interactive Button

```jsx
import AnimatedButton from '@/components/AnimatedButton';

// Standard
<AnimatedButton onClick={handleClick}>
  Click Me
</AnimatedButton>

// With magnetic effect (hero CTAs only)
<AnimatedButton magnetic>
  Get Started
</AnimatedButton>
```

## 🔧 Customization

### Adjust Global Timing

Edit `src/lib/animations/core.js`:

```js
export const DURATIONS = {
  instant: 0.2,
  fast: 0.4,
  normal: 0.8,    // ← Change for slower/faster
  slow: 1.2,
  cinematic: 1.8,
};
```

### Change Default Easing

```js
export const EASINGS = {
  smooth: 'power3.out',  // ← Default
  snappy: 'power4.out',
  cinematic: 'expo.out',
};
```

## 🐛 Troubleshooting

### Animations Not Running?
1. Add `'use client'` directive
2. Check refs are attached before animation
3. Verify useGSAP dependencies

### Flickering?
- useGSAP uses `useLayoutEffect` (prevents flicker)
- Set initial states with `gsap.set()` first

### ScrollTrigger Issues?
```jsx
useGSAP(() => {
  createScrollReveal(/* ... */);

  return () => killScrollTriggers(trigger);
}, []);
```

## 📊 What's Different from Framer Motion?

### GSAP Advantages
✅ Better performance (lower overhead)
✅ More precise timeline control
✅ ScrollTrigger is industry-leading
✅ GSAP Flip for layout transitions
✅ SVG capabilities built-in
✅ Smaller bundle for complex animations

### When to Use Each
- **GSAP**: Complex sequences, scroll animations, SVG, layout transitions
- **Framer Motion**: Simple enter/exit, gesture controls

## 🎓 Learning Path

1. **Start Simple**: Use ready-made components (`AnimatedHero`, `AnimatedButton`)
2. **Add Scroll**: Wrap sections in `AnimatedSection`
3. **Custom Animations**: Use `useGSAP` hook with helper functions
4. **Advanced**: Create custom timelines with precise overlaps

## 🚢 Production Checklist

- ✅ Test on mobile devices
- ✅ Check with `prefers-reduced-motion` enabled
- ✅ Verify 60fps in Chrome DevTools
- ✅ Limit staggered items to ≤20 per timeline
- ✅ Ensure all ScrollTriggers are killed on unmount
- ✅ Only animate transform and opacity

## 🔗 Resources

- **GSAP Official Docs**: https://gsap.com/docs/
- **ScrollTrigger**: https://gsap.com/docs/v3/Plugins/ScrollTrigger/
- **Flip Plugin**: https://gsap.com/docs/v3/Plugins/Flip/

---

## 🎬 Get Started

**See demos**:
```bash
npm run dev
# Visit /animation-demo
```

**Read guides**:
- `IMPLEMENTATION_GUIDE.md` - Step-by-step integration
- `ANIMATION_GUIDE.md` - Complete API reference

**Use components**:
```jsx
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedButton from '@/components/AnimatedButton';
```

---

**Remember**: The best animations are the ones users don't consciously notice. They just make everything feel more premium, intentional, and polished.
