/**
 * GSAP Flip Animations
 *
 * WHY: FLIP (First, Last, Invert, Play) technique for seamless layout transitions.
 * Use for grid → detail views, reordering, responsive layout changes.
 *
 * Feels magic because DOM changes happen instantly, but we animate the
 * visual change. No janky reflows.
 */

'use client';

import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { EASINGS, DURATIONS } from './core';

// Register Flip plugin
if (typeof window !== 'undefined') {
  gsap.registerPlugin(Flip);
}

/**
 * Basic Flip transition
 *
 * WHY: Smoothly animate layout changes.
 *
 * Usage:
 * 1. const state = Flip.getState(elements)
 * 2. Make DOM changes (reorder, move, resize, etc.)
 * 3. Flip.from(state, { options })
 */
export const createFlipTransition = (elements, options = {}) => {
  const {
    duration = DURATIONS.normal,
    ease = EASINGS.smooth,
    absolute = false,     // Use position: absolute during animation
    scale = true,         // Animate scale changes
    fade = false,         // Fade elements in/out
    stagger = 0,
  } = options;

  const state = Flip.getState(elements);

  return {
    state,
    animate: (callback) => {
      // User makes DOM changes in callback
      if (callback) callback();

      // Animate from previous state to new state
      return Flip.from(state, {
        duration,
        ease,
        absolute,
        scale,
        fade,
        stagger,
      });
    },
  };
};

/**
 * Grid to detail view transition
 *
 * WHY: When clicking a grid item to expand into detail view.
 * Element smoothly grows from thumbnail to full-screen.
 *
 * Usage:
 * 1. Save state of grid item
 * 2. Move item to detail container
 * 3. Animate the transition
 */
export const gridToDetailTransition = (gridItem, detailContainer, options = {}) => {
  const {
    duration = DURATIONS.slow,
    ease = EASINGS.cinematic,
    zIndex = 100,
    onComplete = null,
  } = options;

  // Get initial state
  const state = Flip.getState(gridItem);

  // Move element to detail container
  detailContainer.appendChild(gridItem);

  // Animate the transition
  return Flip.from(state, {
    duration,
    ease,
    absolute: true,
    scale: true,
    zIndex,
    onComplete,
  });
};

/**
 * Detail to grid transition (reverse)
 *
 * WHY: Closing detail view back to grid position.
 */
export const detailToGridTransition = (detailItem, gridContainer, gridIndex, options = {}) => {
  const {
    duration = DURATIONS.normal,
    ease = EASINGS.smooth,
  } = options;

  const state = Flip.getState(detailItem);

  // Move back to grid
  if (gridIndex !== undefined) {
    gridContainer.insertBefore(detailItem, gridContainer.children[gridIndex]);
  } else {
    gridContainer.appendChild(detailItem);
  }

  return Flip.from(state, {
    duration,
    ease,
    absolute: true,
    scale: true,
  });
};

/**
 * Reorder list items
 *
 * WHY: When sorting/filtering changes item order.
 * Items smoothly shuffle to new positions.
 */
export const reorderItems = (container, newOrder, options = {}) => {
  const {
    duration = DURATIONS.normal,
    ease = EASINGS.smooth,
    stagger = 0.03,
  } = options;

  const items = Array.from(container.children);
  const state = Flip.getState(items);

  // Reorder DOM
  newOrder.forEach((index) => {
    container.appendChild(items[index]);
  });

  return Flip.from(state, {
    duration,
    ease,
    stagger,
  });
};

/**
 * Layout change animation (grid columns, view mode, etc.)
 *
 * WHY: When switching between grid/list view or changing grid columns.
 * Items animate to new layout positions.
 */
export const animateLayoutChange = (container, layoutChangeCallback, options = {}) => {
  const {
    duration = DURATIONS.normal,
    ease = EASINGS.smooth,
    stagger = 0.05,
  } = options;

  const items = Array.from(container.children);
  const state = Flip.getState(items);

  // User changes layout (add/remove classes, change grid, etc.)
  layoutChangeCallback();

  return Flip.from(state, {
    duration,
    ease,
    stagger,
    absolute: false,  // Keep items in flow
  });
};

/**
 * Shared element transition between pages
 *
 * WHY: For hero images that persist across navigation.
 * Think Medium article image expanding to full post.
 */
export const sharedElementTransition = (sourceElement, targetElement, options = {}) => {
  const {
    duration = DURATIONS.slow,
    ease = EASINGS.cinematic,
  } = options;

  // Clone source element
  const clone = sourceElement.cloneNode(true);
  const state = Flip.getState(sourceElement);

  // Replace source with target temporarily
  sourceElement.style.opacity = '0';
  document.body.appendChild(clone);

  // Position clone at target location
  Flip.fit(clone, targetElement, {
    absolute: true,
    scale: true,
  });

  // Animate from source to target
  return Flip.from(state, {
    targets: clone,
    duration,
    ease,
    onComplete: () => {
      clone.remove();
      targetElement.style.opacity = '1';
    },
  });
};
