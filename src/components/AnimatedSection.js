/**
 * AnimatedSection Component
 *
 * WHY: Reusable section with scroll-triggered reveal.
 * Wraps any content and animates on scroll.
 *
 * WHEN TO USE: Sections with important content that benefits from reveal
 * WHEN NOT TO USE: Every single section (over-animation kills the effect)
 */

'use client';

import { useRef } from 'react';
import { useGSAP } from '@/hooks/useGSAP';
import { createScrollReveal, killScrollTriggers } from '@/lib/animations';

export default function AnimatedSection({
  children,
  className = '',
  threshold = 0.2,    // Reveal when 20% visible
  stagger = 0.1,
  y = 40,             // Slide distance
}) {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const section = sectionRef.current;
    if (!section) return;

    // Animate children if they exist, otherwise animate section itself
    const targets = section.children.length > 0
      ? Array.from(section.children)
      : section;

    createScrollReveal(section, targets, {
      start: `top ${100 - threshold * 100}%`,
      stagger,
      y,
    });

    // Cleanup
    return () => {
      killScrollTriggers(section);
    };
  }, [threshold, stagger, y]);

  return (
    <section ref={sectionRef} className={className}>
      {children}
    </section>
  );
}
