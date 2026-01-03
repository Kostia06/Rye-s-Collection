/**
 * AnimatedHero Component
 *
 * WHY: Demonstrates premium hero animation using GSAP.
 * Cinematic entrance with overlapping timelines.
 *
 * WHEN TO USE: Landing pages, major section intros
 */

'use client';

import { useRef } from 'react';
import { Sparkles } from 'lucide-react';
import { useGSAP } from '@/hooks/useGSAP';
import { createHeroAnimation } from '@/lib/animations';

export default function AnimatedHero({
  headline = 'My Collection',
  subtitle = 'A beautiful showcase of treasured collectibles',
  showCTA = false,
  ctaText = 'Explore',
  onCTAClick = null,
}) {
  // Refs for animated elements
  const headlineRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const decorationRefs = useRef([]);

  // Set up decoration refs
  const setDecorationRef = (index) => (el) => {
    if (el) decorationRefs.current[index] = el;
  };

  // Run hero animation on mount
  useGSAP(() => {
    createHeroAnimation({
      headline: headlineRef.current,
      subtitle: subtitleRef.current,
      cta: showCTA ? ctaRef.current : null,
      decorations: decorationRefs.current,
    });
  }, []); // Empty deps = run once on mount

  return (
    <div className="text-center mb-8 sm:mb-12 relative">
      {/* Headline */}
      <div
        ref={headlineRef}
        className="flex items-center justify-center gap-3 sm:gap-4 mb-4"
      >
        <Sparkles
          ref={setDecorationRef(0)}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-purple-500 fill-purple-500"
        />
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
          {headline}
        </h1>
        <Sparkles
          ref={setDecorationRef(1)}
          className="w-8 h-8 sm:w-10 sm:h-10 md:w-12 md:h-12 text-pink-500 fill-pink-500"
        />
      </div>

      {/* Subtitle */}
      {subtitle && (
        <p
          ref={subtitleRef}
          className="text-purple-600 text-lg sm:text-xl md:text-2xl font-medium max-w-2xl mx-auto"
        >
          {subtitle}
        </p>
      )}

      {/* CTA */}
      {showCTA && (
        <button
          ref={ctaRef}
          onClick={onCTAClick}
          className="mt-8 px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-lg font-bold rounded-full shadow-xl hover:shadow-2xl transition-shadow"
        >
          {ctaText}
        </button>
      )}
    </div>
  );
}
