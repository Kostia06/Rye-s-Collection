'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const HEART_PATH = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

// Floating heart that rises from bottom
function FloatingHeart({ delay, left, size, duration, opacity }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{ left: `${left}%`, bottom: -40 }}
      initial={{ y: 0, opacity: 0, scale: 0 }}
      animate={{
        y: '-110vh',
        opacity: [0, opacity, opacity, opacity, 0],
        scale: [0, 1, 1.1, 1, 0.6],
        x: [0, (Math.random() - 0.5) * 80, (Math.random() - 0.5) * 60],
        rotate: [0, (Math.random() - 0.5) * 50],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'easeOut',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className="text-red-400/50">
        <path d={HEART_PATH} />
      </svg>
    </motion.div>
  );
}

// Tiny sparkle
function Sparkle({ top, left, delay, size }) {
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{ top, left }}
      animate={{
        scale: [0, 1, 0],
        opacity: [0, 0.8, 0],
        rotate: [0, 180],
      }}
      transition={{
        duration: 1.8 + Math.random(),
        repeat: Infinity,
        delay,
        ease: 'easeInOut',
      }}
    >
      <svg width={size} height={size} viewBox="0 0 12 12" fill="none">
        <path d="M6 0L7.5 4.5L12 6L7.5 7.5L6 12L4.5 7.5L0 6L4.5 4.5L6 0Z" fill="rgba(255,200,200,0.5)" />
      </svg>
    </motion.div>
  );
}

// Heartbeat ripple ring
function HeartbeatRing({ size, delay, color }) {
  return (
    <motion.div
      className="absolute rounded-full border-2"
      style={{
        width: size,
        height: size,
        borderColor: color,
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }}
      animate={{
        scale: [0.8, 1.6],
        opacity: [0.4, 0],
      }}
      transition={{
        duration: 2,
        repeat: Infinity,
        delay,
        ease: 'easeOut',
      }}
    />
  );
}

// Animated text that types in letter by letter
function TypeWriter({ text, delay, className }) {
  const [displayed, setDisplayed] = useState('');

  useEffect(() => {
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, i + 1));
          i++;
        } else {
          clearInterval(interval);
        }
      }, 60);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return (
    <span className={className}>
      {displayed}
      {displayed.length < text.length && (
        <motion.span
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
          className="inline-block w-[2px] h-[1em] bg-current ml-0.5 align-middle"
        />
      )}
    </span>
  );
}

// Falling petal
function FallingPetal({ delay, left, duration }) {
  return (
    <motion.div
      className="fixed pointer-events-none z-0"
      style={{ left: `${left}%`, top: -20 }}
      initial={{ y: 0, opacity: 0 }}
      animate={{
        y: '110vh',
        opacity: [0, 0.6, 0.6, 0],
        x: [0, (Math.random() - 0.5) * 100, (Math.random() - 0.5) * 80],
        rotate: [0, 360 * (Math.random() > 0.5 ? 1 : -1)],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: 'linear',
      }}
    >
      <div
        className="w-3 h-4 rounded-full bg-gradient-to-b from-pink-300/40 to-red-300/20"
        style={{ borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)' }}
      />
    </motion.div>
  );
}

export default function ValentinePage() {
  const [phase, setPhase] = useState(0); // 0=intro, 1=reveal, 2=message
  const [scrollPercent, setScrollPercent] = useState(0);
  const containerRef = useRef(null);

  // Stable random values via useMemo
  const hearts = useMemo(() =>
    Array.from({ length: 25 }, (_, i) => ({
      id: `heart-${i}`,
      delay: i * 0.4,
      left: (i * 17 + 7) % 100,
      size: 14 + (i % 5) * 5,
      duration: 7 + (i % 4) * 2,
      opacity: 0.25 + (i % 3) * 0.15,
    })), []);

  const petals = useMemo(() =>
    Array.from({ length: 12 }, (_, i) => ({
      id: `petal-${i}`,
      delay: i * 0.8,
      left: (i * 23 + 11) % 100,
      duration: 8 + (i % 3) * 3,
    })), []);

  const sparkles = useMemo(() =>
    Array.from({ length: 20 }, (_, i) => ({
      id: `sparkle-${i}`,
      top: `${(i * 19 + 5) % 100}%`,
      left: `${(i * 23 + 13) % 100}%`,
      delay: i * 0.3,
      size: 8 + (i % 3) * 4,
    })), []);

  // Phase transitions
  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 1200);
    const t2 = setTimeout(() => setPhase(2), 2800);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);

  // Scroll tracking
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const onScroll = () => {
      const max = el.scrollHeight - el.clientHeight;
      setScrollPercent(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-b from-rose-950 via-red-900 to-rose-950 overflow-hidden">
      {/* Ambient gradient orbs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute -top-32 -left-32 w-72 h-72 bg-red-500/20 rounded-full blur-3xl"
          animate={{ scale: [1, 1.4, 1], x: [0, 40, 0], y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute -bottom-32 -right-32 w-80 h-80 bg-pink-500/15 rounded-full blur-3xl"
          animate={{ scale: [1.2, 1, 1.2], x: [0, -30, 0], y: [0, -40, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-rose-400/10 rounded-full blur-3xl"
          animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        />
      </div>

      {/* Floating hearts */}
      {hearts.map((h) => <FloatingHeart key={h.id} {...h} />)}

      {/* Falling petals */}
      {petals.map((p) => <FallingPetal key={p.id} {...p} />)}

      {/* Sparkles layer */}
      <div className="absolute inset-0 pointer-events-none">
        {sparkles.map((s) => <Sparkle key={s.id} {...s} />)}
      </div>

      {/* Progress bar */}
      <div className="fixed top-0 left-0 right-0 z-50 h-0.5 bg-white/10">
        <div
          className="h-full bg-gradient-to-r from-pink-400 to-red-400 transition-[width] duration-150 ease-out"
          style={{ width: `${scrollPercent}%` }}
        />
      </div>

      {/* Main scrollable content */}
      <div
        ref={containerRef}
        className="absolute inset-0 overflow-y-auto overflow-x-hidden z-10 scrollbar-hide"
        style={{ WebkitOverflowScrolling: 'touch' }}
      >
        {/* === HERO SECTION === */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 relative">
          {/* Central heart with ripple rings */}
          <div className="relative flex items-center justify-center" style={{ width: 200, height: 200 }}>
            <HeartbeatRing size={160} delay={0} color="rgba(248,113,113,0.3)" />
            <HeartbeatRing size={200} delay={0.4} color="rgba(251,146,146,0.2)" />
            <HeartbeatRing size={240} delay={0.8} color="rgba(253,164,175,0.15)" />

            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 12, delay: 0.3 }}
              className="relative z-10"
            >
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 1.2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="100" height="100" viewBox="0 0 24 24" fill="currentColor" className="text-red-400 drop-shadow-2xl">
                  <path d={HEART_PATH} />
                </svg>
              </motion.div>
            </motion.div>
          </div>

          {/* Title */}
          {phase >= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: 'easeOut' }}
              className="mt-8 text-center"
            >
              <p className="text-pink-300/70 text-xs uppercase tracking-[0.4em] mb-3">
                Happy Valentine&apos;s Day
              </p>
              <h1 className="font-serif text-5xl sm:text-7xl text-white leading-tight">
                For You,
                <br />
                <motion.span
                  className="text-red-300 inline-block"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5, type: 'spring', stiffness: 150 }}
                >
                  Rye
                </motion.span>
              </h1>
            </motion.div>
          )}

          {/* Date */}
          {phase >= 2 && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
              className="mt-6 text-pink-200/40 text-xs tracking-[0.3em] uppercase"
            >
              February 14th
            </motion.p>
          )}

          {/* Scroll hint */}
          {phase >= 2 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
              className="absolute bottom-10 flex flex-col items-center gap-2"
            >
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="text-pink-300/50">
                  <path d="M12 5v14M19 12l-7 7-7-7" />
                </svg>
              </motion.div>
            </motion.div>
          )}
        </section>

        {/* === MESSAGE SECTIONS === */}
        <section className="px-6 sm:px-8 max-w-md mx-auto space-y-24 py-20">
          {/* Section 1 */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              className="inline-block mb-6"
            >
              <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" className="text-red-400/80 mx-auto">
                <path d={HEART_PATH} />
              </svg>
            </motion.div>
            <p className="text-pink-100/80 text-base leading-relaxed">
              Every moment with you feels like a beautiful dream I never want to wake up from.
            </p>
          </motion.div>

          {/* Section 2 - with floating hearts on sides */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="relative"
          >
            <div className="bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10 p-8">
              <p className="font-serif text-xl text-red-200/90 italic leading-relaxed text-center">
                &ldquo;I love you not only for what you are, but for what I am when I am with you.&rdquo;
              </p>
            </div>
          </motion.div>

          {/* Section 3 */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <p className="text-pink-100/80 text-base leading-relaxed">
              You make ordinary days extraordinary just by being in them. Your laugh is my favorite sound, your smile is my favorite sight.
            </p>
          </motion.div>

          {/* Section 4 - typewriter */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.5 }}
            className="text-center py-8"
          >
            <p className="font-serif text-2xl text-pink-200 leading-relaxed">
              <TypeWriter
                text="You are my today and all of my tomorrows."
                delay={0.3}
                className="text-pink-200"
              />
            </p>
          </motion.div>

          {/* Section 5 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7, type: 'spring' }}
            className="text-center"
          >
            <p className="text-pink-100/70 text-base leading-relaxed">
              Thank you for being my person, my safe place, and my greatest adventure.
            </p>
          </motion.div>

          {/* Egg joke */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 0.7 }}
            className="text-center"
          >
            <motion.p
              className="text-pink-200/50 text-sm"
              animate={{ rotate: [0, 3, -3, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
            >
              🥚
            </motion.p>
            <p className="text-pink-100/80 text-base leading-relaxed mt-4">
              You know why I can&apos;t make you breakfast on Valentine&apos;s Day?
            </p>
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 1.5, duration: 0.8 }}
              className="text-pink-200/90 text-lg font-serif italic mt-4"
            >
              Because you already have my heart &mdash; and I&apos;m too egg-cited to cook.
            </motion.p>
          </motion.div>
        </section>

        {/* === CLOSING - SIGNATURE === */}
        <section className="py-12 px-6">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
            className="text-center"
          >
            <p className="font-serif text-lg text-pink-200/60 italic">
              With all my love,
            </p>
            <p className="font-serif text-2xl text-pink-200/80 mt-2">
              Kos
            </p>
          </motion.div>
        </section>

        {/* === FINAL HEART EXPLOSION === */}
        <section className="min-h-screen flex flex-col items-center justify-center px-6 pb-24 relative">
          <motion.div
            initial={{ opacity: 0, scale: 0.3 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring', stiffness: 80, damping: 12 }}
            className="text-center relative"
          >
            {/* Multiple pulsing ring layers */}
            <div className="relative inline-flex items-center justify-center" style={{ width: 200, height: 200 }}>
              <HeartbeatRing size={120} delay={0} color="rgba(248,113,113,0.4)" />
              <HeartbeatRing size={160} delay={0.3} color="rgba(251,146,146,0.3)" />
              <HeartbeatRing size={200} delay={0.6} color="rgba(253,164,175,0.2)" />
              <HeartbeatRing size={250} delay={0.9} color="rgba(253,164,175,0.1)" />

              {/* Orbiting mini hearts */}
              {[0, 1, 2, 3].map((i) => (
                <motion.div
                  key={`orbit-${i}`}
                  className="absolute"
                  style={{ width: 140, height: 140, top: '50%', left: '50%', marginTop: -70, marginLeft: -70 }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 0.5 }}
                >
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="text-red-300/50"
                    style={{ position: 'absolute', top: 0, left: '50%', marginLeft: -7 }}
                  >
                    <path d={HEART_PATH} />
                  </svg>
                </motion.div>
              ))}

              {/* Center heart */}
              <motion.div
                className="relative z-10"
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 1, repeat: Infinity, ease: 'easeInOut' }}
              >
                <svg width="72" height="72" viewBox="0 0 24 24" fill="currentColor" className="text-red-400 drop-shadow-[0_0_30px_rgba(248,113,113,0.5)]">
                  <path d={HEART_PATH} />
                </svg>
              </motion.div>
            </div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mt-10 font-serif text-3xl sm:text-4xl text-white/90"
            >
              I love you, Rye
            </motion.h2>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.8, duration: 1 }}
              className="mt-4 text-pink-300/40 text-xs uppercase tracking-[0.3em]"
            >
              Today, tomorrow, and always
            </motion.p>
          </motion.div>
        </section>
      </div>

      {/* Hide scrollbar */}
      <style jsx global>{`
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
