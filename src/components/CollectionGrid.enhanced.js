/**
 * Enhanced CollectionGrid with GSAP Animations
 *
 * WHY: Replaces Framer Motion with GSAP for better performance and control.
 * Features stagger reveals, smooth loading states, empty state animations.
 *
 * Copy this into your CollectionGrid.js to replace the Framer Motion version.
 */

'use client';

import { useRef } from 'react';
import CollectionCard from './CollectionCard';
import CollectionListItem from './CollectionListItem';
import { Sparkles, Package } from 'lucide-react';
import { useGSAP, useAnimationRefs } from '@/hooks/useGSAP';
import { staggerFadeIn, loadingPulse, DURATIONS } from '@/lib/animations';
import gsap from 'gsap';

export default function CollectionGrid({ items, loading, isAdmin, onEdit, onDelete, view = 'grid' }) {
  const loadingIconRef = useRef(null);
  const emptyStateRef = useRef(null);
  const emptyIconRef = useRef(null);
  const { refs: itemRefs, setRef: setItemRef, clearRefs } = useAnimationRefs();

  // Loading spinner animation
  useGSAP(() => {
    if (!loading || !loadingIconRef.current) return;

    // Continuous rotation
    const rotationTl = gsap.timeline({ repeat: -1 });
    rotationTl.to(loadingIconRef.current, {
      rotate: 360,
      duration: 2,
      ease: 'linear',
    });

    // Pulsing text
    const pulseTl = loadingPulse(loadingIconRef.current.nextElementSibling, {
      opacity: [1, 0.5],
      duration: 1.5,
    });

    return () => {
      rotationTl.kill();
      pulseTl.kill();
    };
  }, [loading]);

  // Empty state animation
  useGSAP(() => {
    if (loading || items?.length > 0 || !emptyStateRef.current) return;

    const tl = gsap.timeline();

    // Container fades in
    gsap.set(emptyStateRef.current, { opacity: 0, scale: 0.95 });
    tl.to(emptyStateRef.current, {
      opacity: 1,
      scale: 1,
      duration: DURATIONS.normal,
      ease: 'power3.out',
    });

    // Icon bounces
    if (emptyIconRef.current) {
      gsap.set(emptyIconRef.current, { y: 0 });
      tl.to(emptyIconRef.current, {
        y: -10,
        duration: 1.5,
        ease: 'power2.inOut',
        repeat: -1,
        yoyo: true,
      }, '-=0.3');
    }

    return () => tl.kill();
  }, [loading, items?.length]);

  // Items stagger reveal
  useGSAP(() => {
    if (loading || !items?.length || itemRefs.current.length === 0) return;

    staggerFadeIn(itemRefs.current, {
      stagger: 0.05,
      y: 30,
      duration: DURATIONS.fast,
    });

    return () => clearRefs();
  }, [items?.length, loading]);

  // Loading state
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <div ref={loadingIconRef}>
          <Sparkles className="w-12 h-12 text-purple-500" />
        </div>
        <p className="mt-4 text-gray-600 font-medium">Loading treasures...</p>
      </div>
    );
  }

  // Empty state
  if (!items || items.length === 0) {
    return (
      <div
        ref={emptyStateRef}
        className="flex flex-col items-center justify-center min-h-[400px] text-center p-8"
      >
        <div ref={emptyIconRef}>
          <Package className="w-24 h-24 text-purple-300 mb-4" />
        </div>
        <h3 className="text-2xl font-bold text-gray-700 mb-2">
          No items yet!
        </h3>
        <p className="text-gray-500">
          The collection is waiting to be filled with treasures.
        </p>
      </div>
    );
  }

  // List view
  if (view === 'list') {
    return (
      <div className="max-w-4xl mx-auto space-y-4">
        {items.map((item, index) => (
          <div key={item.id} ref={setItemRef(index)}>
            <CollectionListItem
              item={item}
              index={index}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
        ))}
      </div>
    );
  }

  // Grid view
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
      {items.map((item, index) => (
        <div key={item.id} ref={setItemRef(index)}>
          <CollectionCard
            item={item}
            index={index}
            isAdmin={isAdmin}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </div>
      ))}
    </div>
  );
}
