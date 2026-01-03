/**
 * SVG Animations
 *
 * WHY: Line drawing and path animations for icons, logos, decorations.
 * Lightweight, precise, cinematic when done right.
 */

'use client';

import gsap from 'gsap';
import { EASINGS, DURATIONS } from './core';

/**
 * SVG line draw animation
 *
 * WHY: Classic reveal technique. Use for logos, icons, decorative elements.
 * Requires SVG paths to have stroke (no fill initially).
 *
 * Usage:
 * 1. Ensure SVG has stroke defined
 * 2. Remove fill or set fill to animate after draw completes
 */
export const drawSVGPath = (path, options = {}) => {
  const {
    duration = DURATIONS.slow,
    ease = EASINGS.smooth,
    delay = 0,
    fill = null,  // Fill color after draw (optional)
  } = options;

  // Get path length
  const length = path.getTotalLength();

  // Set initial state (hidden)
  gsap.set(path, {
    strokeDasharray: length,
    strokeDashoffset: length,
  });

  const tl = gsap.timeline({ delay });

  // Draw the line
  tl.to(path, {
    strokeDashoffset: 0,
    duration,
    ease,
  });

  // Add fill after draw (if specified)
  if (fill) {
    tl.to(path, {
      fill,
      duration: DURATIONS.fast,
      ease: EASINGS.smooth,
    }, `-=${DURATIONS.fast * 0.5}`);
  }

  return tl;
};

/**
 * Draw multiple SVG paths with stagger
 *
 * WHY: For complex SVGs with multiple paths (logos, illustrations).
 * Stagger creates choreographed reveal.
 */
export const drawSVGPaths = (paths, options = {}) => {
  const {
    stagger = 0.1,
    duration = DURATIONS.slow,
    ease = EASINGS.smooth,
  } = options;

  const tl = gsap.timeline();

  paths.forEach((path, index) => {
    const length = path.getTotalLength();

    gsap.set(path, {
      strokeDasharray: length,
      strokeDashoffset: length,
    });

    tl.to(path, {
      strokeDashoffset: 0,
      duration,
      ease,
    }, index * stagger);
  });

  return tl;
};

/**
 * SVG morph (requires paths with same number of points)
 *
 * WHY: Smooth shape transitions for icons that change state.
 * Use sparingly - complex morphs can be janky.
 */
export const morphSVG = (path, newPath, options = {}) => {
  const {
    duration = DURATIONS.normal,
    ease = EASINGS.smooth,
  } = options;

  return gsap.to(path, {
    morphSVG: newPath,
    duration,
    ease,
  });
};

/**
 * Animate SVG viewBox (zoom/pan effect)
 *
 * WHY: For revealing details or creating focus.
 * Premium feel when combined with path animations.
 */
export const animateSVGViewBox = (svg, viewBoxValues, options = {}) => {
  const {
    duration = DURATIONS.slow,
    ease = EASINGS.smooth,
  } = options;

  const [x, y, width, height] = viewBoxValues;

  return gsap.to(svg, {
    attr: {
      viewBox: `${x} ${y} ${width} ${height}`,
    },
    duration,
    ease,
  });
};

/**
 * SVG element cascade reveal
 *
 * WHY: For SVG illustrations with multiple grouped elements.
 * Each group reveals in sequence (scale + fade).
 */
export const cascadeRevealSVG = (groups, options = {}) => {
  const {
    stagger = 0.15,
    duration = DURATIONS.normal,
    ease = EASINGS.cinematic,
  } = options;

  // Set initial state
  gsap.set(groups, {
    opacity: 0,
    scale: 0.9,
    transformOrigin: 'center center',
  });

  return gsap.to(groups, {
    opacity: 1,
    scale: 1,
    duration,
    ease,
    stagger,
  });
};

/**
 * Pulsing SVG icon animation
 *
 * WHY: Subtle attention-grabber for important icons.
 * Very restrained - just a gentle pulse.
 */
export const pulseSVG = (element, options = {}) => {
  const {
    scale = 1.1,
    duration = 1.5,
    repeat = -1,  // Infinite
  } = options;

  return gsap.to(element, {
    scale,
    duration,
    ease: 'power2.inOut',
    repeat,
    yoyo: true,
    transformOrigin: 'center center',
  });
};
