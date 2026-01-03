/**
 * Animation System Exports
 *
 * WHY: Single import point for all animations.
 * Clean, organized, easy to discover what's available.
 */

// Core utilities
export * from './core';

// Hooks
export { useGSAP, useAnimationRef, useAnimationRefs } from '@/hooks/useGSAP';

// Hero animations
export * from './hero';

// Scroll animations
export * from './scroll';

// Page transitions
export * from './pageTransitions';

// SVG animations
export * from './svg';

// Flip transitions
export * from './flip';

// Micro-interactions
export * from './microInteractions';
