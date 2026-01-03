/**
 * Animation System Demo Page
 *
 * Visit /animation-demo to see all animations in action.
 * This page demonstrates every animation capability in the system.
 *
 * WHY: Live showcase of all animation types. Use this as a reference
 * or copy patterns into your own components.
 */

'use client';

import { useRef, useState } from 'react';
import { Sparkles, Heart, Star, Zap, ArrowDown, CheckCircle, XCircle } from 'lucide-react';
import { useGSAP, useAnimationRefs } from '@/hooks/useGSAP';
import {
  createHeroAnimation,
  createSimpleHeroAnimation,
  createScrollPromptAnimation,
  createScrollReveal,
  createParallax,
  staggerFadeIn,
  buttonPress,
  successFeedback,
  errorShake,
  countUp,
  drawSVGPath,
  pulseSVG,
  killScrollTriggers,
  EASINGS,
  DURATIONS,
} from '@/lib/animations';
import gsap from 'gsap';

// Components
import AnimatedHero from '@/components/AnimatedHero';
import AnimatedSection from '@/components/AnimatedSection';
import AnimatedButton from '@/components/AnimatedButton';

export default function AnimationDemo() {
  const [count, setCount] = useState(0);

  // Hero section refs
  const heroHeadlineRef = useRef(null);
  const heroSubtitleRef = useRef(null);
  const heroCtaRef = useRef(null);
  const heroDecorations = useRef([]);
  const scrollPromptRef = useRef(null);

  // Stagger demo refs
  const { refs: staggerRefs, setRef: setStaggerRef } = useAnimationRefs();

  // Interaction demo refs
  const buttonRef = useRef(null);
  const successRef = useRef(null);
  const errorRef = useRef(null);
  const countRef = useRef(null);

  // SVG demo refs
  const logoPathRef = useRef(null);
  const pulseIconRef = useRef(null);

  // Parallax ref
  const parallaxRef = useRef(null);

  // Hero animation
  useGSAP(() => {
    createHeroAnimation({
      headline: heroHeadlineRef.current,
      subtitle: heroSubtitleRef.current,
      cta: heroCtaRef.current,
      decorations: heroDecorations.current,
    });

    createScrollPromptAnimation(scrollPromptRef.current);
  }, []);

  // Stagger demo
  useGSAP(() => {
    if (staggerRefs.current.length === 0) return;
    staggerFadeIn(staggerRefs.current, {
      stagger: 0.1,
      y: 30,
    });
  }, [staggerRefs.current.length]);

  // SVG line draw
  useGSAP(() => {
    if (!logoPathRef.current) return;
    drawSVGPath(logoPathRef.current, {
      duration: 2,
      delay: 1,
    });

    if (pulseIconRef.current) {
      pulseSVG(pulseIconRef.current, {
        scale: 1.15,
        duration: 2,
      });
    }
  }, []);

  // Parallax
  useGSAP(() => {
    if (!parallaxRef.current) return;
    createParallax(parallaxRef.current, {
      speed: 0.3,
    });
  }, []);

  // Interaction handlers
  const handleButtonPress = () => {
    if (buttonRef.current) {
      buttonPress(buttonRef.current);
    }
  };

  const handleSuccess = () => {
    if (successRef.current) {
      successFeedback(successRef.current);
    }
  };

  const handleError = () => {
    if (errorRef.current) {
      errorShake(errorRef.current);
    }
  };

  const handleCountUp = () => {
    const target = Math.floor(Math.random() * 10000);
    setCount(target);
    if (countRef.current) {
      countUp(countRef.current, target, {
        duration: 2,
        decimals: 0,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-pink-50">
      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden px-4">
        {/* Parallax background */}
        <div
          ref={parallaxRef}
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage: 'radial-gradient(circle, purple 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />

        <div className="text-center relative z-10">
          {/* Animated headline */}
          <div ref={heroHeadlineRef} className="flex items-center justify-center gap-4 mb-4">
            <Sparkles
              ref={(el) => (heroDecorations.current[0] = el)}
              className="w-12 h-12 text-purple-500 fill-purple-500"
            />
            <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 bg-clip-text text-transparent">
              GSAP Animation System
            </h1>
            <Star
              ref={(el) => (heroDecorations.current[1] = el)}
              className="w-12 h-12 text-pink-500 fill-pink-500"
            />
          </div>

          {/* Subtitle */}
          <p ref={heroSubtitleRef} className="text-2xl text-purple-600 mb-8 max-w-2xl mx-auto">
            Premium, cinematic, intentional motion for modern web experiences
          </p>

          {/* CTA */}
          <div ref={heroCtaRef}>
            <AnimatedButton magnetic onClick={() => console.log('CTA clicked')}>
              Explore Animations
            </AnimatedButton>
          </div>
        </div>

        {/* Scroll prompt */}
        <div ref={scrollPromptRef} className="absolute bottom-12">
          <ArrowDown className="w-8 h-8 text-purple-400" />
        </div>
      </section>

      {/* Stagger Reveal Demo */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-900">
            Stagger Reveals
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((item, index) => (
              <div
                key={item}
                ref={setStaggerRef(index)}
                className="bg-white rounded-2xl p-8 shadow-lg"
              >
                <Zap className="w-12 h-12 text-purple-500 mb-4" />
                <h3 className="text-xl font-bold mb-2">Feature {item}</h3>
                <p className="text-gray-600">
                  Elements reveal with subtle stagger. Not sequential, overlapping.
                </p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Micro-Interactions Demo */}
      <AnimatedSection className="py-20 px-4 bg-white">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-purple-900">
            Micro-Interactions
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Button Press */}
            <div className="bg-purple-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Button Press</h3>
              <p className="text-gray-600 mb-4">Tactile feedback on click</p>
              <button
                ref={buttonRef}
                onClick={handleButtonPress}
                className="bg-purple-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Press Me
              </button>
            </div>

            {/* Success Feedback */}
            <div className="bg-green-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Success Feedback</h3>
              <p className="text-gray-600 mb-4">Visual confirmation</p>
              <button
                onClick={handleSuccess}
                className="bg-green-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                <CheckCircle ref={successRef} className="w-5 h-5" />
                Success
              </button>
            </div>

            {/* Error Shake */}
            <div className="bg-red-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Error Shake</h3>
              <p className="text-gray-600 mb-4">Clear negative feedback</p>
              <button
                onClick={handleError}
                className="bg-red-600 text-white px-6 py-3 rounded-full font-semibold flex items-center gap-2"
              >
                <XCircle ref={errorRef} className="w-5 h-5" />
                Error
              </button>
            </div>

            {/* Count Up */}
            <div className="bg-blue-50 rounded-2xl p-8">
              <h3 className="text-xl font-bold mb-4">Count Up Animation</h3>
              <p className="text-gray-600 mb-4">Dynamic number reveals</p>
              <div className="text-4xl font-bold text-blue-600 mb-4" ref={countRef}>
                {count}
              </div>
              <button
                onClick={handleCountUp}
                className="bg-blue-600 text-white px-6 py-3 rounded-full font-semibold"
              >
                Animate Number
              </button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* SVG Animations Demo */}
      <AnimatedSection className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-12 text-purple-900">
            SVG Animations
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            {/* Line Draw */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Line Draw</h3>
              <svg
                width="200"
                height="200"
                viewBox="0 0 200 200"
                className="mx-auto"
              >
                <path
                  ref={logoPathRef}
                  d="M 50 100 Q 100 50, 150 100 Q 100 150, 50 100"
                  stroke="purple"
                  strokeWidth="3"
                  fill="none"
                />
              </svg>
              <p className="text-gray-600 mt-4">Path reveals over time</p>
            </div>

            {/* Pulse */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <h3 className="text-xl font-bold mb-4">Pulse Animation</h3>
              <div className="flex justify-center items-center h-[200px]">
                <Heart
                  ref={pulseIconRef}
                  className="w-24 h-24 text-pink-500 fill-pink-500"
                />
              </div>
              <p className="text-gray-600">Gentle, continuous pulse</p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Documentation Link */}
      <section className="py-20 px-4 text-center bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <h2 className="text-4xl font-bold mb-4">Ready to Implement?</h2>
        <p className="text-xl mb-8 opacity-90">
          Check the implementation guide to add these animations to your project
        </p>
        <div className="flex gap-4 justify-center">
          <a
            href="/IMPLEMENTATION_GUIDE.md"
            target="_blank"
            className="bg-white text-purple-600 px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-shadow"
          >
            Implementation Guide
          </a>
          <a
            href="/ANIMATION_GUIDE.md"
            target="_blank"
            className="bg-purple-800 text-white px-8 py-4 rounded-full font-bold text-lg hover:shadow-2xl transition-shadow"
          >
            API Documentation
          </a>
        </div>
      </section>
    </div>
  );
}
