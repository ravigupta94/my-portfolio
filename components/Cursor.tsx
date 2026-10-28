'use client';

import { useEffect, useRef } from 'react';

/**
 * Custom cursor — dot + ring that follow the mouse.
 * Uses event delegation for zero-re-render high performance.
 * Hides on touch devices.
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    // Hide on touch devices
    if (typeof window !== 'undefined' && 'ontouchstart' in window) {
      dot.style.display = 'none';
      ring.style.display = 'none';
      return;
    }

    let mouseX = -100, mouseY = -100;
    let ringX = -100, ringY = -100;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.left = `${mouseX}px`;
      dot.style.top = `${mouseY}px`;

      // Check if hovering over clickable element using event delegation
      const target = e.target as HTMLElement | null;
      if (target && target.closest('a, button, [role="button"], input, textarea, [data-cursor-hover]')) {
        dot.classList.add('cursor-hover');
        ring.classList.add('cursor-hover');
      } else {
        dot.classList.remove('cursor-hover');
        ring.classList.remove('cursor-hover');
      }
    };

    // Smooth ring follow with damping
    const animateRing = () => {
      ringX += (mouseX - ringX) * 0.15;
      ringY += (mouseY - ringY) * 0.15;
      ring.style.left = `${ringX}px`;
      ring.style.top = `${ringY}px`;
      rafId = requestAnimationFrame(animateRing);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafId = requestAnimationFrame(animateRing);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      <div ref={dotRef} className="cursor-dot" aria-hidden="true" />
      <div ref={ringRef} className="cursor-ring" aria-hidden="true" />
    </>
  );
}
