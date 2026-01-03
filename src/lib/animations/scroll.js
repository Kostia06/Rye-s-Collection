/**
 * Scroll-Based Animations
 *
 * WHY: ScrollTrigger for scroll-linked reveals. Used judiciously - not every
 * section needs animation. Only meaningful moments get motion.
 */

'use client';

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { EASINGS, DURATIONS } from './core';

// Register plugin (client-side only)
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Standard section reveal on scroll
 *
 * WHY: Fade + slide up is subtle but effective. Not distracting.
 * trigger: Element that triggers animation when in view
 * targets: Elements to animate (can be same as trigger)
 */
export const createScrollReveal = (trigger, targets, options = {}) => {
  const {
    start = 'top 80%',     // Trigger when element is 80% down viewport
    end = 'bottom 20%',
    scrub = false,          // No scrub by default - feels better for reveals
    markers = false,        // Debug only
    stagger = 0.1,
    y = 40,                // Slide distance
    opacity = 0,           // Start invisible
    duration = DURATIONS.normal,
  } = options;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger,
      start,
      end,
      scrub,
      markers,
      toggleActions: 'play none none none', // Play once, don't reverse
    },
  });

  // Set initial state
  gsap.set(targets, { y, opacity });

  // Animate in
  tl.to(targets, {
    y: 0,
    opacity: 1,
    duration,
    ease: EASINGS.smooth,
    stagger,
  });

  return tl;
};

/**
 * Parallax effect for background elements
 *
 * WHY: Very subtle parallax adds depth without being gimmicky.
 * Only use on non-interactive background elements.
 */
export const createParallax = (element, options = {}) => {
  const {
    speed = 0.5,           // 0.5 = half speed (subtle)
    start = 'top bottom',
    end = 'bottom top',
  } = options;

  gsap.to(element, {
    y: () => element.offsetHeight * speed,
    ease: 'none',
    scrollTrigger: {
      trigger: element,
      start,
      end,
      scrub: true,         // Parallax always scrubs
      invalidateOnRefresh: true,
    },
  });
};

/**
 * Pin section while scrolling
 *
 * WHY: Use sparingly. Only when content truly benefits from being pinned.
 * Example: Side-by-side content where one side changes.
 */
export const createPinSection = (element, options = {}) => {
  const {
    start = 'top top',
    end = '+=100%',
    pin = true,
    scrub = true,
  } = options;

  return ScrollTrigger.create({
    trigger: element,
    start,
    end,
    pin,
    scrub,
    anticipatePin: 1,      // Smooth pinning
  });
};

/**
 * Horizontal scroll section
 *
 * WHY: For wide content like timelines or image galleries.
 * Feels premium when done right.
 */
export const createHorizontalScroll = (container, items, options = {}) => {
  const {
    start = 'top top',
    end = () => `+=${container.scrollWidth}`,
  } = options;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: container,
      start,
      end,
      scrub: 1,            // Smooth scrub
      pin: true,
      anticipatePin: 1,
    },
  });

  tl.to(items, {
    x: () => -(container.scrollWidth - window.innerWidth),
    ease: 'none',
  });

  return tl;
};

/**
 * Cleanup all ScrollTriggers
 *
 * WHY: Must be called in component cleanup to prevent memory leaks
 */
export const killScrollTriggers = (trigger) => {
  if (trigger) {
    ScrollTrigger.getAll()
      .filter((st) => st.trigger === trigger)
      .forEach((st) => st.kill());
  } else {
    ScrollTrigger.getAll().forEach((st) => st.kill());
  }
};

/**
 * Refresh ScrollTrigger calculations
 *
 * WHY: Call after DOM changes (images load, content added, etc.)
 */
export const refreshScrollTriggers = () => {
  ScrollTrigger.refresh();
};
