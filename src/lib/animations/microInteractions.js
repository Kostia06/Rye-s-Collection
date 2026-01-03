/**
 * Micro-Interactions
 *
 * WHY: Limited, intentional micro-animations for high-importance elements only.
 * No hover spam. Fast, snappy, purposeful.
 *
 * Use these for:
 * - Primary CTAs
 * - Critical UI feedback
 * - Interactive elements that benefit from tactile feel
 *
 * Do NOT use for:
 * - Every button
 * - Decorative elements
 * - Anything that animates repeatedly
 */

'use client';

import gsap from 'gsap';
import { EASINGS, DURATIONS } from './core';

/**
 * Button press micro-interaction
 *
 * WHY: Tactile feedback. User knows their click registered.
 * Subtle scale down on click, spring back.
 */
export const buttonPress = (button, options = {}) => {
  const {
    scale = 0.95,
    duration = DURATIONS.instant,
  } = options;

  return gsap.to(button, {
    scale,
    duration,
    ease: EASINGS.snappy,
    yoyo: true,
    repeat: 1,
  });
};

/**
 * Magnetic button effect (subtle)
 *
 * WHY: Premium feel. Button gently "pulls" toward cursor.
 * Use only for hero CTAs or primary actions.
 */
export const magneticButton = (button, options = {}) => {
  const {
    strength = 0.3,  // How much to move (0-1)
    speed = 0.3,
  } = options;

  let isHovering = false;

  const handleMouseMove = (e) => {
    if (!isHovering) return;

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * strength;
    const deltaY = (e.clientY - centerY) * strength;

    gsap.to(button, {
      x: deltaX,
      y: deltaY,
      duration: speed,
      ease: EASINGS.smooth,
    });
  };

  const handleMouseEnter = () => {
    isHovering = true;
  };

  const handleMouseLeave = () => {
    isHovering = false;
    gsap.to(button, {
      x: 0,
      y: 0,
      duration: speed * 1.5,
      ease: EASINGS.elastic,
    });
  };

  button.addEventListener('mousemove', handleMouseMove);
  button.addEventListener('mouseenter', handleMouseEnter);
  button.addEventListener('mouseleave', handleMouseLeave);

  // Return cleanup function
  return () => {
    button.removeEventListener('mousemove', handleMouseMove);
    button.removeEventListener('mouseenter', handleMouseEnter);
    button.removeEventListener('mouseleave', handleMouseLeave);
  };
};

/**
 * Success feedback animation
 *
 * WHY: Confirming actions (like, save, submit).
 * Quick scale pulse + color flash.
 */
export const successFeedback = (element, options = {}) => {
  const {
    scale = 1.1,
    duration = DURATIONS.fast,
  } = options;

  const tl = gsap.timeline();

  tl.to(element, {
    scale,
    duration: duration / 2,
    ease: EASINGS.snappy,
  }).to(element, {
    scale: 1,
    duration: duration / 2,
    ease: EASINGS.elastic,
  });

  return tl;
};

/**
 * Error shake animation
 *
 * WHY: Clear negative feedback. User knows something's wrong.
 * Horizontal shake, quick and obvious.
 */
export const errorShake = (element, options = {}) => {
  const {
    distance = 10,
    repeat = 3,
  } = options;

  return gsap.to(element, {
    x: distance,
    duration: 0.1,
    repeat: repeat * 2 - 1,
    yoyo: true,
    ease: EASINGS.snappy,
    onComplete: () => {
      gsap.set(element, { x: 0 });
    },
  });
};

/**
 * Count up animation
 *
 * WHY: For stats, numbers that should feel dynamic.
 * Animates from 0 to target value.
 */
export const countUp = (element, targetValue, options = {}) => {
  const {
    duration = DURATIONS.slow,
    ease = EASINGS.smooth,
    decimals = 0,
  } = options;

  const obj = { value: 0 };

  return gsap.to(obj, {
    value: targetValue,
    duration,
    ease,
    onUpdate: () => {
      element.textContent = obj.value.toFixed(decimals);
    },
  });
};

/**
 * Ripple effect (like Material Design)
 *
 * WHY: Visual feedback on click. Shows exactly where user clicked.
 * Clean, modern, informative.
 */
export const createRipple = (container, event, options = {}) => {
  const {
    color = 'rgba(255, 255, 255, 0.3)',
    duration = DURATIONS.normal,
  } = options;

  const rect = container.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height);
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;

  const ripple = document.createElement('span');
  ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: ${color};
    pointer-events: none;
    top: ${y}px;
    left: ${x}px;
    transform: scale(0);
  `;

  container.style.position = 'relative';
  container.style.overflow = 'hidden';
  container.appendChild(ripple);

  const tl = gsap.timeline({
    onComplete: () => ripple.remove(),
  });

  tl.to(ripple, {
    scale: 1,
    opacity: 1,
    duration: duration / 2,
    ease: EASINGS.smooth,
  }).to(ripple, {
    opacity: 0,
    duration: duration / 2,
    ease: EASINGS.smooth,
  });

  return tl;
};

/**
 * Loading pulse animation
 *
 * WHY: Shows something is happening during async operations.
 * Subtle, not distracting.
 */
export const loadingPulse = (element, options = {}) => {
  const {
    opacity = [1, 0.5],
    duration = 1,
  } = options;

  return gsap.to(element, {
    opacity: opacity[1],
    duration,
    ease: 'power2.inOut',
    repeat: -1,
    yoyo: true,
  });
};

/**
 * Stagger fade in for lists
 *
 * WHY: When content loads (search results, filtered items).
 * Progressive disclosure feels intentional.
 */
export const staggerFadeIn = (items, options = {}) => {
  const {
    stagger = 0.05,
    duration = DURATIONS.fast,
    y = 20,
  } = options;

  gsap.set(items, { opacity: 0, y });

  return gsap.to(items, {
    opacity: 1,
    y: 0,
    duration,
    stagger,
    ease: EASINGS.smooth,
  });
};
