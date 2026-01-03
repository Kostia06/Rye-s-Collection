/**
 * Page Transition System
 *
 * WHY: Smooth exit → enter prevents jarring page changes.
 * Direction-aware transitions feel intentional, not random.
 */

'use client';

import gsap from 'gsap';
import { EASINGS, DURATIONS } from './core';

/**
 * Page exit animation
 *
 * WHY: Fade out current page before navigating.
 * Clean, doesn't distract from destination.
 */
export const pageExit = (container, options = {}) => {
  const {
    duration = DURATIONS.fast,
    direction = 'up',  // up, down, left, right, fade
  } = options;

  const tl = gsap.timeline();

  // Direction-based movement
  const movement = {
    up: { y: -30 },
    down: { y: 30 },
    left: { x: -30 },
    right: { x: 30 },
    fade: {},
  };

  tl.to(container, {
    opacity: 0,
    ...movement[direction],
    duration,
    ease: EASINGS.smooth,
  });

  return tl;
};

/**
 * Page enter animation
 *
 * WHY: New page slides in after exit completes.
 * Slightly offset timing prevents symmetry.
 */
export const pageEnter = (container, options = {}) => {
  const {
    duration = DURATIONS.normal,
    direction = 'up',
    delay = 0.1,  // Small delay after exit
  } = options;

  const tl = gsap.timeline({ delay });

  // Set initial state (opposite direction)
  const initialState = {
    up: { y: 40, opacity: 0 },
    down: { y: -40, opacity: 0 },
    left: { x: 40, opacity: 0 },
    right: { x: -40, opacity: 0 },
    fade: { opacity: 0 },
  };

  gsap.set(container, initialState[direction]);

  // Animate to final state
  tl.to(container, {
    x: 0,
    y: 0,
    opacity: 1,
    duration,
    ease: EASINGS.cinematic,
  });

  return tl;
};

/**
 * Complete page transition (exit → enter)
 *
 * WHY: Orchestrates full transition. Direction can be determined
 * by route (e.g., forward vs back navigation).
 */
export const pageTransition = async (exitContainer, enterContainer, options = {}) => {
  const { direction = 'up' } = options;

  // Exit current page
  await pageExit(exitContainer, { direction }).then();

  // Enter new page
  pageEnter(enterContainer, { direction });
};

/**
 * Overlay wipe transition
 *
 * WHY: Premium-feeling overlay that wipes across screen.
 * Think Apple product pages.
 */
export const createOverlayWipe = (overlay, content, options = {}) => {
  const {
    direction = 'right',  // Direction overlay moves
    duration = DURATIONS.normal,
    color = '#000',
  } = options;

  const tl = gsap.timeline();

  // Set overlay initial state
  const initialX = direction === 'right' ? '-100%' : '100%';
  gsap.set(overlay, {
    x: initialX,
    backgroundColor: color,
  });

  // Overlay wipes in
  tl.to(overlay, {
    x: '0%',
    duration,
    ease: EASINGS.cinematic,
  });

  // Content fades out during wipe
  tl.to(content, {
    opacity: 0,
    duration: duration * 0.5,
    ease: EASINGS.smooth,
  }, `-=${duration * 0.3}`);

  // Overlay wipes out
  tl.to(overlay, {
    x: direction === 'right' ? '100%' : '-100%',
    duration,
    ease: EASINGS.cinematic,
  });

  // New content fades in
  tl.to(content, {
    opacity: 1,
    duration: duration * 0.5,
    ease: EASINGS.smooth,
  }, `-=${duration * 0.3}`);

  return tl;
};

/**
 * Crossfade transition
 *
 * WHY: Simplest transition. Use when content is very different
 * and directional movement would feel arbitrary.
 */
export const crossfade = (exitElement, enterElement, options = {}) => {
  const {
    duration = DURATIONS.normal,
    stagger = 0.1,
  } = options;

  const tl = gsap.timeline();

  // Fade out
  tl.to(exitElement, {
    opacity: 0,
    duration,
    ease: EASINGS.smooth,
  });

  // Fade in (slight overlap)
  tl.to(enterElement, {
    opacity: 1,
    duration,
    ease: EASINGS.smooth,
  }, `-=${duration - stagger}`);

  return tl;
};
