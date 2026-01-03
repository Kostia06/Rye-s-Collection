/**
 * Custom GSAP Hook
 *
 * WHY: Encapsulates GSAP lifecycle in React. Client-side only, proper cleanup.
 * Using useLayoutEffect ensures animations run before paint (no flicker).
 */

'use client';

import { useLayoutEffect, useRef } from 'react';
import gsap from 'gsap';

/**
 * Primary GSAP hook for component animations
 *
 * @param {Function} animation - Function that returns GSAP timeline or tween
 * @param {Array} dependencies - Re-run animation when these change
 *
 * WHY useLayoutEffect: Runs synchronously after DOM mutations but before paint.
 * Critical for preventing animation flicker on initial render.
 */
export const useGSAP = (animation, dependencies = []) => {
  const contextRef = useRef();

  useLayoutEffect(() => {
    // Create GSAP context for automatic cleanup
    contextRef.current = gsap.context(() => {
      animation();
    });

    // Cleanup function - kills all animations in this context
    return () => {
      contextRef.current?.revert();
    };
  }, dependencies);

  return contextRef;
};

/**
 * Hook for refs that will be animated
 * WHY: Type-safe ref creation with proper null checking
 */
export const useAnimationRef = () => {
  return useRef(null);
};

/**
 * Hook for managing multiple animation refs
 * WHY: Grid items, staggered lists need array refs
 */
export const useAnimationRefs = () => {
  const refs = useRef([]);

  const setRef = (index) => (el) => {
    if (el) refs.current[index] = el;
  };

  const clearRefs = () => {
    refs.current = [];
  };

  return { refs, setRef, clearRefs };
};
