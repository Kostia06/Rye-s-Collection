/**
 * Core GSAP Animation Utilities
 *
 * WHY: Centralized configuration ensures consistent timing, easing, and performance
 * across the entire site. Premium feel comes from subtle, well-timed sequences.
 */

import gsap from 'gsap';

// Global GSAP defaults - expensive-feeling timing
gsap.defaults({
  ease: 'power3.out',
  duration: 0.8,
});

/**
 * Standard easing curves used throughout the site
 * WHY: Limited easing palette creates cohesion. These are proven to feel premium.
 */
export const EASINGS = {
  smooth: 'power3.out',      // Default for most UI
  snappy: 'power4.out',      // Quick, responsive micro-interactions
  cinematic: 'expo.out',     // Hero sections, major reveals
  elastic: 'back.out(1.4)',  // Subtle overshoot for playful elements (use sparingly)
};

/**
 * Standard durations
 * WHY: Consistency in timing creates rhythm. Slightly longer than typical web = premium.
 */
export const DURATIONS = {
  instant: 0.2,   // Micro-interactions
  fast: 0.4,      // UI feedback
  normal: 0.8,    // Standard transitions
  slow: 1.2,      // Hero animations
  cinematic: 1.8, // Major reveals only
};

/**
 * Stagger configuration
 * WHY: Overlapping rather than sequential = fluid, not robotic
 */
export const STAGGERS = {
  tight: 0.05,   // Subtle cascade
  normal: 0.1,   // Standard stagger
  loose: 0.15,   // Emphasized sequence
};

/**
 * Creates a master timeline with standard settings
 * WHY: Timelines allow complex sequencing without callback hell
 */
export const createTimeline = (options = {}) => {
  return gsap.timeline({
    defaults: {
      ease: EASINGS.smooth,
      duration: DURATIONS.normal,
    },
    ...options,
  });
};

/**
 * Kills all GSAP animations on specific elements
 * WHY: Cleanup prevents memory leaks and stacking animations
 */
export const killAnimations = (elements) => {
  if (!elements) return;
  const targets = Array.isArray(elements) ? elements : [elements];
  targets.forEach((el) => {
    if (el) gsap.killTweensOf(el);
  });
};

/**
 * Safe animation helper that respects prefers-reduced-motion
 * WHY: Accessibility is non-negotiable. Reduced motion users get instant transitions.
 */
export const shouldReduceMotion = () => {
  if (typeof window === 'undefined') return false;
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
};

/**
 * Wrapper for animations that respects user preferences
 * WHY: Graceful degradation for accessibility
 */
export const animateWithReducedMotion = (animation) => {
  if (shouldReduceMotion()) {
    // Return a timeline that completes instantly
    return gsap.timeline({ duration: 0 });
  }
  return animation();
};
