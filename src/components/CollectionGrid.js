'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import ItemPreviewModal from './ItemPreviewModal';

// Register GSAP plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Generate fingerprint for likes
const getUserFingerprint = () => {
  if (typeof window === 'undefined') return 'server';
  let fingerprint = localStorage.getItem('user_fingerprint');
  if (!fingerprint) {
    fingerprint = `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('user_fingerprint', fingerprint);
  }
  return fingerprint;
};

// 8 placeholder images for the gallery
const placeholderImages = Array.from({ length: 8 }, (_, i) =>
  `https://picsum.photos/seed/gallery${i + 1}/800/1000`
);

// Direction configurations matching snake path: RIGHT → DOWN → LEFT → DOWN (repeat)
const directions = [
  { x: '100vw', y: '0vh', rotation: 8, label: 'RIGHT' },   // From right
  { x: '0vw', y: '100vh', rotation: -8, label: 'BOTTOM' }, // From bottom
  { x: '-100vw', y: '0vh', rotation: -8, label: 'LEFT' },  // From left
  { x: '0vw', y: '100vh', rotation: 8, label: 'BOTTOM' },  // From bottom (repeat)
];

// Artist names for captions
const artists = [
  { name: 'Elena Vasquez', year: '2023' },
  { name: 'Marcus Chen', year: '2022' },
  { name: 'Sofia Andersson', year: '2024' },
  { name: 'James Wright', year: '2021' },
  { name: 'Amara Okonkwo', year: '2023' },
  { name: 'Luca Romano', year: '2022' },
  { name: 'Yuki Tanaka', year: '2024' },
  { name: 'Isabel Torres', year: '2023' },
];

// Minimal fixed navigation
function Navigation() {
  return (
    <nav className="fixed top-0 left-0 z-50 p-6 md:p-8">
      <span className="text-xs tracking-[0.2em] uppercase text-neutral-500 hover:text-[#1a1a1a] transition-colors cursor-pointer">
        Gallery
      </span>
    </nav>
  );
}

// SVG Snake-Path Roadmap - zigzag pattern: right → down → left → down → repeat
function SnakePathRoadmap({ progress, current, total }) {
  // SVG path dimensions
  const width = 80;
  const height = 400;
  const segmentHeight = height / 4; // 4 horizontal segments
  const horizontalLength = 50;
  const padding = 15;

  // Build the snake path: right → down → left → down → right → down → left
  // Starting from top-left, going right first
  const pathPoints = [
    `M ${padding} ${padding}`, // Start
    `H ${padding + horizontalLength}`, // Right
    `V ${padding + segmentHeight}`, // Down
    `H ${padding}`, // Left
    `V ${padding + segmentHeight * 2}`, // Down
    `H ${padding + horizontalLength}`, // Right
    `V ${padding + segmentHeight * 3}`, // Down
    `H ${padding}`, // Left
    `V ${height - padding}`, // Down to end
  ];

  const snakePath = pathPoints.join(' ');

  // Calculate total path length (approximate)
  const totalLength = (horizontalLength * 4) + (segmentHeight * 4);

  // Calculate dot position along the path
  const getDotPosition = (progress) => {
    const pathLength = totalLength;
    const currentLength = progress * pathLength;

    // Segments: right(50) + down(100) + left(50) + down(100) + right(50) + down(100) + left(50) + down(100)
    const segments = [
      { length: horizontalLength, type: 'h', dir: 1 },  // right
      { length: segmentHeight, type: 'v', dir: 1 },     // down
      { length: horizontalLength, type: 'h', dir: -1 }, // left
      { length: segmentHeight, type: 'v', dir: 1 },     // down
      { length: horizontalLength, type: 'h', dir: 1 },  // right
      { length: segmentHeight, type: 'v', dir: 1 },     // down
      { length: horizontalLength, type: 'h', dir: -1 }, // left
      { length: segmentHeight, type: 'v', dir: 1 },     // down
    ];

    let x = padding;
    let y = padding;
    let accumulated = 0;

    for (const seg of segments) {
      if (accumulated + seg.length >= currentLength) {
        const remaining = currentLength - accumulated;
        const ratio = remaining / seg.length;
        if (seg.type === 'h') {
          x += seg.dir * seg.length * ratio;
        } else {
          y += seg.dir * seg.length * ratio;
        }
        break;
      }
      accumulated += seg.length;
      if (seg.type === 'h') {
        x += seg.dir * seg.length;
      } else {
        y += seg.dir * seg.length;
      }
    }

    return { x, y };
  };

  const dotPos = getDotPosition(progress);

  return (
    <div className="fixed right-6 top-1/2 -translate-y-1/2 z-50 hidden md:flex flex-col items-center">
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        className="overflow-visible"
      >
        {/* Background path - 20% opacity (ahead) */}
        <path
          d={snakePath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
          strokeOpacity="0.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Progress path - 100% opacity (behind current position) */}
        <path
          d={snakePath}
          fill="none"
          stroke="#1a1a1a"
          strokeWidth="1"
          strokeOpacity="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={totalLength}
          strokeDashoffset={totalLength - (progress * totalLength)}
          style={{ transition: 'stroke-dashoffset 0.1s ease-out' }}
        />

        {/* Traveling dot indicator */}
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r="4"
          fill="#1a1a1a"
          style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
        />

        {/* Dot glow effect */}
        <circle
          cx={dotPos.x}
          cy={dotPos.y}
          r="8"
          fill="#1a1a1a"
          fillOpacity="0.15"
          style={{ transition: 'cx 0.1s ease-out, cy 0.1s ease-out' }}
        />
      </svg>

      {/* Position counter */}
      <span className="mt-4 text-xs text-neutral-400 font-mono tracking-wider">
        {String(current + 1).padStart(2, '0')}/{String(total).padStart(2, '0')}
      </span>
    </div>
  );
}

// Gallery slide component
function GallerySlide({ item, index, slideRef, captionRef, direction, isVisible }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.likeCount || 0);
  const [showPreview, setShowPreview] = useState(false);

  useEffect(() => {
    if (!item?.id || item.id.startsWith('placeholder')) return;
    const checkLiked = async () => {
      const fingerprint = getUserFingerprint();
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('item_id', item.id)
        .eq('user_fingerprint', fingerprint)
        .single();
      setIsLiked(!!data);
    };
    checkLiked();
  }, [item?.id]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!item?.id || item.id.startsWith('placeholder')) return;

    const fingerprint = getUserFingerprint();
    try {
      if (isLiked) {
        await supabase.from('likes').delete()
          .eq('item_id', item.id)
          .eq('user_fingerprint', fingerprint);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await supabase.from('likes').insert([{ item_id: item.id, user_fingerprint: fingerprint }]);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const imageUrl = item?.image_url || placeholderImages[index % 8];
  const title = item?.title || `Untitled ${index + 1}`;
  const artist = artists[index % 8];

  // Use isVisible for initial state before GSAP kicks in
  const initialStyle = index === 0 ? { opacity: 1 } : { opacity: 0 };

  return (
    <>
      <div
        ref={slideRef}
        className="gallery-slide absolute inset-0 flex items-center justify-center pointer-events-none"
        style={initialStyle}
      >
        <div className="relative flex flex-col items-center pointer-events-auto">
          {/* Image container */}
          <div
            className="relative overflow-hidden bg-neutral-100 shadow-2xl cursor-pointer group"
            style={{ maxHeight: '70vh', maxWidth: '50vw' }}
            onClick={() => setShowPreview(true)}
          >
            <img
              src={imageUrl}
              alt={title}
              className="w-auto h-[70vh] max-w-[50vw] object-cover transition-transform duration-700 group-hover:scale-105"
              loading={index < 2 ? 'eager' : 'lazy'}
            />

            {/* Overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-500" />

            {/* Like button */}
            <button
              onClick={toggleLike}
              className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
            >
              <Heart className={`w-5 h-5 ${isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-600'}`} />
            </button>

            {/* Direction indicator */}
            <div className="absolute bottom-4 left-4 text-white/60 text-xs tracking-widest uppercase">
              {direction.label}
            </div>
          </div>

          {/* Caption - fades in after image settles */}
          <div
            ref={captionRef}
            className="mt-8 text-center opacity-0"
          >
            <h3 className="font-serif text-2xl md:text-3xl text-[#1a1a1a] tracking-wide">
              {title}
            </h3>
            <p className="mt-2 text-neutral-500 text-sm tracking-[0.15em] uppercase">
              {artist.name} — {artist.year}
            </p>
            {likeCount > 0 && (
              <p className="mt-2 text-neutral-400 text-xs">
                {likeCount} {likeCount === 1 ? 'like' : 'likes'}
              </p>
            )}
          </div>
        </div>
      </div>

      {item && !item.id?.startsWith('placeholder') && (
        <ItemPreviewModal
          item={item}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          likeCount={likeCount}
          isLiked={isLiked}
          onToggleLike={toggleLike}
        />
      )}
    </>
  );
}

// Mobile Gallery Card Component - Optimized for touch
function MobileGalleryCard({ item, index, placeholderImages, artists, directions }) {
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(item?.likeCount || 0);
  const [showPreview, setShowPreview] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  useEffect(() => {
    if (!item?.id || item.id.startsWith('placeholder')) return;
    const checkLiked = async () => {
      const fingerprint = getUserFingerprint();
      const { data } = await supabase
        .from('likes')
        .select('id')
        .eq('item_id', item.id)
        .eq('user_fingerprint', fingerprint)
        .single();
      setIsLiked(!!data);
    };
    checkLiked();
  }, [item?.id]);

  const toggleLike = async (e) => {
    e.stopPropagation();
    if (!item?.id || item.id.startsWith('placeholder')) return;

    const fingerprint = getUserFingerprint();
    try {
      if (isLiked) {
        await supabase.from('likes').delete()
          .eq('item_id', item.id)
          .eq('user_fingerprint', fingerprint);
        setIsLiked(false);
        setLikeCount(prev => Math.max(0, prev - 1));
      } else {
        await supabase.from('likes').insert([{ item_id: item.id, user_fingerprint: fingerprint }]);
        setIsLiked(true);
        setLikeCount(prev => prev + 1);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const imageUrl = item?.image_url || placeholderImages[index % 8];
  const title = item?.title || `Untitled ${index + 1}`;
  const artist = artists[index % 8];

  return (
    <>
      <div
        className="relative bg-white rounded-2xl overflow-hidden shadow-sm active:scale-[0.98] transition-transform duration-150"
        onClick={() => setShowPreview(true)}
      >
        {/* Image */}
        <div className="relative aspect-[4/5] bg-neutral-100">
          {!imageLoaded && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 border-2 border-neutral-200 border-t-neutral-400 rounded-full animate-spin" />
            </div>
          )}
          <img
            src={imageUrl}
            alt={title}
            className={`w-full h-full object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading={index < 2 ? 'eager' : 'lazy'}
            onLoad={() => setImageLoaded(true)}
          />

          {/* Index badge */}
          <div className="absolute top-3 left-3 bg-[#1a1a1a]/80 backdrop-blur-sm text-white text-xs px-2.5 py-1 rounded-full font-medium">
            {String(index + 1).padStart(2, '0')}
          </div>

          {/* Like button - larger touch target */}
          <button
            onClick={toggleLike}
            className="absolute top-3 right-3 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center active:scale-90 transition-transform"
          >
            <Heart
              className={`w-5 h-5 transition-colors ${
                isLiked ? 'text-red-500 fill-red-500' : 'text-neutral-400'
              }`}
            />
          </button>

          {/* Gradient overlay */}
          <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/50 to-transparent" />

          {/* Title on image */}
          <div className="absolute bottom-0 left-0 right-0 p-4">
            <h3 className="font-serif text-xl text-white leading-tight">
              {title}
            </h3>
            <p className="mt-1 text-white/70 text-xs tracking-wide">
              {artist.name} · {artist.year}
            </p>
          </div>
        </div>

        {/* Bottom info bar */}
        <div className="px-4 py-3 flex items-center justify-between bg-white">
          <span className="text-xs text-neutral-400 uppercase tracking-wider">
            {directions[index % 4].label}
          </span>
          {likeCount > 0 && (
            <span className="text-xs text-neutral-500">
              {likeCount} {likeCount === 1 ? 'like' : 'likes'}
            </span>
          )}
        </div>
      </div>

      {item && !item.id?.startsWith('placeholder') && (
        <ItemPreviewModal
          item={item}
          isOpen={showPreview}
          onClose={() => setShowPreview(false)}
          likeCount={likeCount}
          isLiked={isLiked}
          onToggleLike={toggleLike}
        />
      )}
    </>
  );
}

export default function CollectionGrid({ items, loading, isAdmin, onEdit, onDelete }) {
  const containerRef = useRef(null);
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const galleryContainerRef = useRef(null);
  const slidesRef = useRef([]);
  const captionsRef = useRef([]);
  const lenisRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isReady, setIsReady] = useState(false);

  const totalSlides = 8;

  // Set ready after mount to ensure refs are populated
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    if (isMobile) return;

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 0.8,
    });

    lenisRef.current = lenis;

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    gsap.ticker.lagSmoothing(0);

    return () => {
      lenis.destroy();
    };
  }, [isMobile]);

  // GSAP Rotating Direction Gallery Animation
  useEffect(() => {
    if (isMobile || !isReady) return;

    const ctx = gsap.context(() => {
      // Hero fade out
      if (heroTextRef.current) {
        gsap.to(heroTextRef.current, {
          opacity: 0,
          scale: 0.9,
          y: -50,
          ease: 'power2.inOut',
          scrollTrigger: {
            trigger: heroRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 1,
          },
        });
      }

      // Main gallery timeline
      const galleryContainer = galleryContainerRef.current;
      if (!galleryContainer) return;

      // Create master timeline
      const masterTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: galleryContainer,
          start: 'top top',
          end: () => `+=${totalSlides * 60}%`, // Shorter scroll distance
          pin: true,
          scrub: 0.3, // Faster scrub response
          anticipatePin: 1,
          snap: {
            snapTo: 1 / (totalSlides - 1),
            duration: { min: 0.1, max: 0.25 }, // Faster snap
            ease: 'power3.out',
          },
          onUpdate: (self) => {
            const slideIndex = Math.round(self.progress * (totalSlides - 1));
            setCurrentSlide(slideIndex);
            setScrollProgress(self.progress);
          },
        },
      });

      // Set initial state for all slides immediately
      slidesRef.current.forEach((slide, i) => {
        if (!slide) return;
        const dir = directions[i % 4];
        // First slide visible and centered, others hidden at their entry positions
        gsap.set(slide, {
          x: i === 0 ? 0 : dir.x,
          y: i === 0 ? 0 : dir.y,
          scale: i === 0 ? 1 : 0.8,
          rotation: i === 0 ? 0 : dir.rotation,
          opacity: i === 0 ? 1 : 0,
          visibility: 'visible',
        });
      });

      // Set initial caption visible for first slide
      if (captionsRef.current[0]) {
        gsap.set(captionsRef.current[0], { opacity: 1 });
      }

      // Create transitions between slides
      for (let i = 0; i < totalSlides - 1; i++) {
        const currentSlide = slidesRef.current[i];
        const nextSlide = slidesRef.current[i + 1];
        const currentCaption = captionsRef.current[i];
        const nextCaption = captionsRef.current[i + 1];
        const nextDir = directions[(i + 1) % 4];

        if (!currentSlide || !nextSlide) continue;

        // Calculate exit direction - opposite of where next card enters
        // This creates a "push" effect where current card is pushed out
        const exitDir = {
          x: nextDir.x === '100vw' ? '-100vw' : nextDir.x === '-100vw' ? '100vw' : '0vw',
          y: nextDir.y === '100vh' ? '-100vh' : nextDir.y === '-100vh' ? '100vh' : '0vw',
          rotation: -nextDir.rotation,
        };

        // Transition duration for each slide
        const transitionLabel = `slide${i}`;

        // Exit current slide - pushed out opposite to where next enters
        masterTimeline.to(
          currentSlide,
          {
            x: exitDir.x,
            y: exitDir.y,
            scale: 0.85,
            rotation: exitDir.rotation,
            opacity: 0,
            ease: 'power3.in',
            duration: 0.5,
          },
          transitionLabel
        );

        // Fade out current caption
        if (currentCaption) {
          masterTimeline.to(
            currentCaption,
            {
              opacity: 0,
              ease: 'power2.in',
              duration: 0.15,
            },
            transitionLabel
          );
        }

        // Enter next slide - starts sooner for overlap
        masterTimeline.fromTo(
          nextSlide,
          {
            x: nextDir.x,
            y: nextDir.y,
            scale: 0.85,
            rotation: nextDir.rotation,
            opacity: 0,
          },
          {
            x: 0,
            y: 0,
            scale: 1,
            rotation: 0,
            opacity: 1,
            ease: 'power3.out',
            duration: 0.5,
          },
          transitionLabel + '+=0.15' // More overlap for snappier feel
        );

        // Fade in next caption after slide settles
        if (nextCaption) {
          masterTimeline.to(
            nextCaption,
            {
              opacity: 1,
              ease: 'power2.out',
              duration: 0.2,
            },
            transitionLabel + '+=0.5'
          );
        }
      }
    }, containerRef);

    return () => ctx.revert();
  }, [isMobile, totalSlides, items?.length, isReady]);

  // Handle resize
  useEffect(() => {
    const handleResize = () => ScrollTrigger.refresh();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Prepare display items
  const displayItems = items?.length > 0
    ? [...items, ...items, ...items].slice(0, totalSlides)
    : Array.from({ length: totalSlides }, (_, i) => ({
        id: `placeholder-${i}`,
        title: `Artwork ${i + 1}`,
        image_url: placeholderImages[i],
      }));

  // Mobile layout - optimized for phones
  if (isMobile) {
    return (
      <div className="min-h-screen bg-[#faf9f6] pb-safe">
        {/* Mobile Header - Fixed */}
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#faf9f6]/90 backdrop-blur-md border-b border-neutral-100">
          <div className="flex items-center justify-between px-4 py-3">
            <span className="font-serif text-lg text-[#1a1a1a]">Collection</span>
            <span className="text-xs text-neutral-400 tracking-wider">
              {totalSlides} works
            </span>
          </div>
        </header>

        {/* Hero - Compact for mobile */}
        <section className="pt-20 pb-8 px-5">
          <h1 className="font-serif text-5xl text-[#1a1a1a] leading-[1.1]">
            The<br />Collection
          </h1>
          <p className="mt-4 text-neutral-400 text-sm">
            Swipe through the gallery
          </p>
        </section>

        {/* Mobile Gallery - Full width cards */}
        <section className="px-4 pb-24 space-y-6">
          {displayItems.map((item, index) => (
            <MobileGalleryCard
              key={item?.id || index}
              item={item}
              index={index}
              placeholderImages={placeholderImages}
              artists={artists}
              directions={directions}
            />
          ))}
        </section>

        {/* Bottom indicator */}
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-[#faf9f6] to-transparent h-20 pointer-events-none" />
      </div>
    );
  }

  // Desktop rotating direction gallery
  return (
    <div ref={containerRef} className="bg-[#faf9f6]">
      <Navigation />

      {/* Hero Section */}
      <section ref={heroRef} className="h-screen flex flex-col justify-center px-10 md:px-20">
        <div ref={heroTextRef}>
          <h1 className="font-serif text-6xl md:text-7xl lg:text-8xl text-[#1a1a1a] leading-[0.95] tracking-tight">
            The
            <br />
            Collection
          </h1>
          <div className="mt-8 flex items-center gap-6">
            <p className="text-neutral-500 tracking-[0.2em] uppercase text-xs">
              {totalSlides} Selected Works
            </p>
            <div className="w-16 h-[1px] bg-neutral-300" />
          </div>

          {/* Snake path pattern preview */}
          <div className="mt-12 flex items-center gap-6">
            <span className="text-xs text-neutral-400 tracking-widest uppercase">Snake path</span>
            <div className="flex items-center gap-1 text-neutral-300">
              <span className="text-xs">→</span>
              <span className="text-xs">↓</span>
              <span className="text-xs">←</span>
              <span className="text-xs">↓</span>
              <span className="text-xs">→</span>
              <span className="text-xs">↓</span>
              <span className="text-xs">←</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-10 left-10 md:left-20 flex items-center gap-4">
          <div className="w-[1px] h-12 bg-neutral-300 animate-pulse" />
          <span className="text-xs text-neutral-400 tracking-widest uppercase">Scroll to explore</span>
        </div>
      </section>

      {/* Pinned Gallery Container */}
      <section
        ref={galleryContainerRef}
        className="relative h-screen overflow-hidden"
      >
        {/* Background decoration */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[80vh] border border-neutral-100 rounded-lg" />
        </div>

        {/* Gallery slides */}
        {displayItems.map((item, index) => (
          <GallerySlide
            key={item?.id || index}
            item={item}
            index={index}
            slideRef={(el) => (slidesRef.current[index] = el)}
            captionRef={(el) => (captionsRef.current[index] = el)}
            direction={directions[index % 4]}
            isVisible={index === currentSlide}
          />
        ))}

        {/* Snake Path Roadmap */}
        <SnakePathRoadmap progress={scrollProgress} current={currentSlide} total={totalSlides} />

        {/* Current direction indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-center">
          <p className="text-xs text-neutral-400 tracking-widest uppercase">
            From {directions[currentSlide % 4].label}
          </p>
        </div>
      </section>

      {/* End section */}
      <section className="h-[50vh] flex flex-col items-center justify-center">
        <p className="font-serif text-3xl text-neutral-300 tracking-wide">Fin</p>
        <div className="mt-4 w-12 h-[1px] bg-neutral-200" />
        <p className="mt-6 text-neutral-400 text-xs tracking-widest uppercase">
          End of Collection
        </p>
      </section>
    </div>
  );
}
