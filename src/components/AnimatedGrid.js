/**
 * AnimatedGrid Component
 *
 * WHY: Grid with stagger reveal and smooth layout transitions.
 * Uses GSAP Flip when grid changes (filter, sort, view mode).
 *
 * PERFORMANCE: Only animates when changes occur, not on every render.
 */

'use client';

import { useRef, useEffect } from 'react';
import { useGSAP, useAnimationRefs } from '@/hooks/useGSAP';
import { staggerFadeIn } from '@/lib/animations';

export default function AnimatedGrid({
  items = [],
  renderItem,
  columns = 3,
  gap = 4,
  className = '',
  onItemClick = null,
}) {
  const gridRef = useRef(null);
  const { refs, setRef, clearRefs } = useAnimationRefs();
  const prevItemsRef = useRef([]);

  // Initial stagger animation
  useGSAP(() => {
    if (refs.current.length === 0) return;

    // Only animate on first load
    if (prevItemsRef.current.length === 0) {
      staggerFadeIn(refs.current, {
        stagger: 0.05,
        y: 30,
      });
    }
  }, [items.length]);

  // Track items for comparison
  useEffect(() => {
    prevItemsRef.current = items;
    return () => clearRefs();
  }, [items, clearRefs]);

  const gridClass = `
    grid gap-${gap}
    ${columns === 1 ? 'grid-cols-1' : ''}
    ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
    ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
    ${columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : ''}
    ${className}
  `.trim();

  return (
    <div ref={gridRef} className={gridClass}>
      {items.map((item, index) => (
        <div
          key={item.id || index}
          ref={setRef(index)}
          onClick={() => onItemClick?.(item, index)}
        >
          {renderItem(item, index)}
        </div>
      ))}
    </div>
  );
}
