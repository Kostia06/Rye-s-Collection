/**
 * AnimatedButton Component
 *
 * WHY: Button with premium micro-interactions.
 * Tactile feedback, magnetic effect (optional), smooth transitions.
 *
 * USE SPARINGLY: Only for primary CTAs and important actions.
 * Don't spam every button with this.
 */

'use client';

import { useRef, useEffect } from 'react';
import { buttonPress, magneticButton } from '@/lib/animations';

export default function AnimatedButton({
  children,
  onClick = null,
  className = '',
  magnetic = false,    // Enable magnetic effect (use for hero CTAs only)
  variant = 'primary',
  disabled = false,
  type = 'button',
  ...props
}) {
  const buttonRef = useRef(null);
  const magneticCleanupRef = useRef(null);

  // Set up magnetic effect
  useEffect(() => {
    if (!magnetic || disabled) return;

    const button = buttonRef.current;
    if (!button) return;

    magneticCleanupRef.current = magneticButton(button, {
      strength: 0.3,
      speed: 0.3,
    });

    return () => {
      magneticCleanupRef.current?.();
    };
  }, [magnetic, disabled]);

  const handleClick = (e) => {
    if (disabled) return;

    // Press animation
    const button = buttonRef.current;
    if (button) {
      buttonPress(button);
    }

    onClick?.(e);
  };

  const variants = {
    primary: 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-700 hover:to-pink-700',
    secondary: 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white hover:from-blue-600 hover:to-cyan-600',
    outline: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50',
  };

  const baseClass = `
    px-6 py-3 rounded-full font-semibold shadow-lg hover:shadow-xl
    transition-shadow duration-300 cursor-pointer
    disabled:opacity-50 disabled:cursor-not-allowed
    ${variants[variant] || variants.primary}
    ${className}
  `.trim();

  return (
    <button
      ref={buttonRef}
      type={type}
      onClick={handleClick}
      disabled={disabled}
      className={baseClass}
      {...props}
    >
      {children}
    </button>
  );
}
