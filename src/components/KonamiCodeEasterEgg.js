'use client';

import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

const KONAMI_CODE = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];

export default function KonamiCodeEasterEgg() {
  const keysPressed = useRef([]);
  const showConfetti = useRef(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      keysPressed.current.push(e.key);
      keysPressed.current = keysPressed.current.slice(-KONAMI_CODE.length);

      if (keysPressed.current.join(',') === KONAMI_CODE.join(',')) {
        triggerConfetti();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const triggerConfetti = () => {
    if (showConfetti.current) return;
    showConfetti.current = true;

    // Create confetti particles
    const confettiPieces = Array.from({ length: 50 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.2,
      duration: 2 + Math.random(),
      rotation: Math.random() * 360,
    }));

    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.top = '0';
    container.style.left = '0';
    container.style.width = '100%';
    container.style.height = '100%';
    container.style.pointerEvents = 'none';
    container.style.zIndex = '9999';

    document.body.appendChild(container);

    const emojis = ['🎉', '✨', '💎', '🌟', '💝', '🎊', '🎈', '🎀'];

    confettiPieces.forEach(piece => {
      const confetti = document.createElement('div');
      confetti.textContent = emojis[Math.floor(Math.random() * emojis.length)];
      confetti.style.position = 'absolute';
      confetti.style.left = piece.left + '%';
      confetti.style.top = '-20px';
      confetti.style.fontSize = '24px';
      confetti.style.animation = `fall ${piece.duration}s linear ${piece.delay}s forwards`;
      container.appendChild(confetti);
    });

    // Add animation to page
    const style = document.createElement('style');
    style.textContent = `
      @keyframes fall {
        to {
          transform: translateY(100vh) rotate(360deg);
          opacity: 0;
        }
      }

      @keyframes bounce {
        0%, 100% { transform: scale(1) rotate(0deg); }
        50% { transform: scale(1.2) rotate(10deg); }
      }

      body.celebration * {
        animation: bounce 0.5s ease-in-out !important;
      }
    `;
    document.head.appendChild(style);

    document.body.classList.add('celebration');

    setTimeout(() => {
      document.body.classList.remove('celebration');
      container.remove();
      style.remove();
      showConfetti.current = false;
    }, 3000);
  };

  return null;
}
