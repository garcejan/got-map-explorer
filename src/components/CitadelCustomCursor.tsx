import React, { useEffect, useState, useRef } from 'react';
import type { MapPickingTarget } from '../types';

interface CitadelCustomCursorProps {
  isActive: boolean;
  mapPickingTarget?: MapPickingTarget;
}

export const CitadelCustomCursor: React.FC<CitadelCustomCursorProps> = ({
  isActive,
  mapPickingTarget
}) => {
  const [isHoveringInteractive, setIsHoveringInteractive] = useState(false);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const reticleRef = useRef<HTMLDivElement>(null);
  const coreRef = useRef<HTMLDivElement>(null);

  // Target and current follower positions for butter-smooth animation
  const posRef = useRef({ x: -100, y: -100 });
  const targetRef = useRef({ x: -100, y: -100 });
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isActive) {
      setIsVisible(false);
      return;
    }

    // Check if device supports fine hover pointer (disable on touch screens)
    if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
      if (!isVisible) {
        setIsVisible(true);
        posRef.current = { x: e.clientX, y: e.clientY };
      }

      // Check if hovering over an interactive element
      const target = e.target as HTMLElement | null;
      if (target) {
        const isInteractive = Boolean(
          target.closest(
            'button, a, input, select, textarea, [role="button"], [role="radio"], [role="tab"], .citadel-marker, .citadel-battle-marker, .citadel-preset-card, .citadel-zoom-btn, .citadel-layer-btn, .citadel-mouse-badge, .citadel-mouse-card'
          )
        );
        setIsHoveringInteractive(isInteractive);
      }
    };

    const handleMouseDown = () => setIsMouseDown(true);
    const handleMouseUp = () => setIsMouseDown(false);
    const handleMouseLeave = () => setIsVisible(false);
    const handleMouseEnter = () => setIsVisible(true);

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mousedown', handleMouseDown, { passive: true });
    window.addEventListener('mouseup', handleMouseUp, { passive: true });
    document.documentElement.addEventListener('mouseleave', handleMouseLeave);
    document.documentElement.addEventListener('mouseenter', handleMouseEnter);

    // Continuous 60fps/120fps animation loop for the outer astrolabe reticle follower
    const renderLoop = () => {
      // Smooth interpolation: 0.22 factor provides fluid glide with no perceptible lag
      posRef.current.x += (targetRef.current.x - posRef.current.x) * 0.24;
      posRef.current.y += (targetRef.current.y - posRef.current.y) * 0.24;

      if (reticleRef.current) {
        reticleRef.current.style.transform = `translate3d(${posRef.current.x}px, ${posRef.current.y}px, 0)`;
      }
      if (coreRef.current) {
        coreRef.current.style.transform = `translate3d(${targetRef.current.x}px, ${targetRef.current.y}px, 0)`;
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    animFrameRef.current = requestAnimationFrame(renderLoop);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mouseup', handleMouseUp);
      document.documentElement.removeEventListener('mouseleave', handleMouseLeave);
      document.documentElement.removeEventListener('mouseenter', handleMouseEnter);
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [isActive, isVisible]);

  if (!isActive || !isVisible) {
    return null;
  }

  const isPicking = Boolean(mapPickingTarget);

  let reticleClass = 'citadel-custom-reticle';
  if (isPicking) {
    reticleClass += ' is-picking';
  } else if (isMouseDown) {
    reticleClass += ' is-dragging';
  } else if (isHoveringInteractive) {
    reticleClass += ' is-hovering';
  }

  return (
    <>
      {/* Outer Floating Astrolabe Reticle with Cardinal Points */}
      <div ref={reticleRef} className={reticleClass} aria-hidden="true" />

      {/* Central Gold Core Pinpoint */}
      <div ref={coreRef} className="citadel-custom-core" aria-hidden="true" />
    </>
  );
};
