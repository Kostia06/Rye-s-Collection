/**
 * Hero Section Animations
 *
 * WHY: Landing moments matter most. Cinematic, intentional sequencing.
 * Apple/Stripe-level polish through precise timing overlaps.
 */

'use client';

import gsap from 'gsap';
import { createTimeline, EASINGS, DURATIONS, STAGGERS } from './core';

/**
 * Premium hero entrance animation
 *
 * Sequence:
 * 1. Headline slides + fades (0s)
 * 2. Subtitle follows slightly delayed (0.2s overlap)
 * 3. CTA appears (0.3s overlap)
 * 4. Background parallax starts (runs throughout)
 *
 * WHY: Overlapping creates fluidity. Sequential feels robotic.
 * Each element has asymmetric timing - no predictability.
 */
export const createHeroAnimation = (elements = {}) => {
  const { headline, subtitle, cta, background, decorations } = elements;

  const tl = createTimeline({
    defaults: {
      ease: EASINGS.cinematic,
    },
  });

  // Set initial states (invisible, slightly below position)
  if (headline) gsap.set(headline, { y: 60, opacity: 0 });
  if (subtitle) gsap.set(subtitle, { y: 40, opacity: 0 });
  if (cta) gsap.set(cta, { y: 30, opacity: 0, scale: 0.9 });
  if (background) gsap.set(background, { opacity: 0, scale: 1.05 });
  if (decorations) gsap.set(decorations, { opacity: 0, scale: 0.8 });

  // Background fades in first (creates stage)
  if (background) {
    tl.to(background, {
      opacity: 0.4,          // Subtle background
      scale: 1,
      duration: DURATIONS.cinematic,
      ease: EASINGS.smooth,
    }, 0);
  }

  // Headline enters (main focus)
  if (headline) {
    tl.to(headline, {
      y: 0,
      opacity: 1,
      duration: DURATIONS.slow,
      ease: EASINGS.cinematic,
    }, 0.3);  // Start 0.3s after background begins
  }

  // Subtitle follows with overlap
  if (subtitle) {
    tl.to(subtitle, {
      y: 0,
      opacity: 1,
      duration: DURATIONS.normal,
      ease: EASINGS.smooth,
    }, '-=0.6');  // Start 0.6s before headline completes
  }

  // CTA scales in (asymmetric timing)
  if (cta) {
    tl.to(cta, {
      y: 0,
      opacity: 1,
      scale: 1,
      duration: DURATIONS.normal,
      ease: EASINGS.snappy,
    }, '-=0.4');  // Start 0.4s before subtitle completes
  }

  // Decorations stagger in (sparkles, icons, etc.)
  if (decorations) {
    tl.to(decorations, {
      opacity: 1,
      scale: 1,
      duration: DURATIONS.fast,
      ease: EASINGS.elastic,
      stagger: STAGGERS.normal,
    }, '-=0.5');
  }

  return tl;
};

/**
 * Simpler hero for secondary pages
 *
 * WHY: Not every page needs full cinematic treatment.
 * This is fast, clean, intentional.
 */
export const createSimpleHeroAnimation = (elements = {}) => {
  const { headline, subtitle } = elements;

  const tl = createTimeline();

  if (headline) {
    gsap.set(headline, { y: 30, opacity: 0 });
    tl.to(headline, {
      y: 0,
      opacity: 1,
      duration: DURATIONS.normal,
      ease: EASINGS.smooth,
    });
  }

  if (subtitle) {
    gsap.set(subtitle, { opacity: 0 });
    tl.to(subtitle, {
      opacity: 1,
      duration: DURATIONS.fast,
      ease: EASINGS.smooth,
    }, '-=0.4');
  }

  return tl;
};

/**
 * Hero scroll prompt animation
 *
 * WHY: Subtle, pulsing down arrow invites exploration.
 * Not intrusive, just helpful.
 */
export const createScrollPromptAnimation = (element) => {
  if (!element) return;

  gsap.set(element, { opacity: 0.6, y: 0 });

  const tl = gsap.timeline({
    repeat: -1,
    repeatDelay: 0.5,
  });

  tl.to(element, {
    y: 10,
    opacity: 1,
    duration: 0.8,
    ease: 'power2.inOut',
  }).to(element, {
    y: 0,
    opacity: 0.6,
    duration: 0.8,
    ease: 'power2.inOut',
  });

  return tl;
};
