'use client';

import { useEffect, useRef } from 'react';

/**
 * Modern High-Performance Neon Magnetic Cursor
 * - Hardware-accelerated GPU translate3d (120fps)
 * - Fluid spring damping interpolation for outer aura
 * - Click shrink & burst ripple feedback
 * - Interactive magnetic hover states with gradient glow
 * - Window enter/leave opacity transitions
 * - Automatically disabled on touch devices
 */
export default function Cursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Disable on touch-enabled devices
    if (typeof window === 'undefined' || 'ontouchstart' in window || navigator.maxTouchPoints > 0) {
      return;
    }

    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let isHovering = false;
    let isClicking = false;
    let isVisible = false;
    let rafId: number;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!isVisible) {
        isVisible = true;
        dot.style.opacity = '1';
        ring.style.opacity = '1';
      }

      // Fast direct update for inner dot for zero perceived latency
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${
        isClicking ? 'scale(0.7)' : isHovering ? 'scale(1.5)' : 'scale(1)'
      }`;

      // Smart delegation for interactive elements
      const target = e.target as HTMLElement | null;
      const clickable = target?.closest(
        'a, button, [role="button"], input, textarea, select, label, [data-cursor-hover], .clickable'
      );

      if (clickable && !isHovering) {
        isHovering = true;
        ring.classList.add('cursor-ring-active');
        dot.classList.add('cursor-dot-active');
      } else if (!clickable && isHovering) {
        isHovering = false;
        ring.classList.remove('cursor-ring-active');
        dot.classList.remove('cursor-dot-active');
      }
    };

    const onMouseDown = () => {
      isClicking = true;
      ring.classList.add('cursor-ring-click');
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) scale(0.65)`;
    };

    const onMouseUp = () => {
      isClicking = false;
      ring.classList.remove('cursor-ring-click');
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) ${
        isHovering ? 'scale(1.5)' : 'scale(1)'
      }`;
    };

    const onMouseLeave = () => {
      isVisible = false;
      dot.style.opacity = '0';
      ring.style.opacity = '0';
    };

    const onMouseEnter = () => {
      isVisible = true;
      dot.style.opacity = '1';
      ring.style.opacity = '1';
    };

    // Smooth spring physics loop for the trailing outer aura
    const render = () => {
      // Ease factor 0.18 gives snappy yet buttery smooth trailing motion
      ringX += (mouseX - ringX) * 0.18;
      ringY += (mouseY - ringY) * 0.18;

      ring.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%) ${
        isClicking ? 'scale(0.85)' : isHovering ? 'scale(1.4)' : 'scale(1)'
      }`;

      rafId = requestAnimationFrame(render);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);
    document.addEventListener('mouseenter', onMouseEnter);

    rafId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
      document.removeEventListener('mouseenter', onMouseEnter);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <>
      {/* Precision inner glowing dot */}
      <div
        ref={dotRef}
        className="cursor-dot"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
      {/* Outer magnetic fluid aura */}
      <div
        ref={ringRef}
        className="cursor-ring"
        style={{ opacity: 0 }}
        aria-hidden="true"
      />
    </>
  );
}
