import { useState, useEffect } from 'react';

const MOBILE_BREAKPOINT = 768;

/**
 * Reactive hook to determine if the current viewport is mobile (< 768px).
 * Desktop (>= 768px) is the primary target and default.
 */
export function useIsMobile(breakpoint: number = MOBILE_BREAKPOINT): boolean {
  const [isMobile, setIsMobile] = useState<boolean>(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < breakpoint;
  });

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const mediaQuery = window.matchMedia(`(max-width: ${breakpoint - 1}px)`);

    const updateMatches = () => {
      setIsMobile(window.innerWidth < breakpoint || mediaQuery.matches);
    };

    updateMatches();

    window.addEventListener('resize', updateMatches);
    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateMatches);
      return () => {
        window.removeEventListener('resize', updateMatches);
        mediaQuery.removeEventListener('change', updateMatches);
      };
    } else {
      // Legacy fallback
      mediaQuery.addListener(updateMatches);
      return () => {
        window.removeEventListener('resize', updateMatches);
        mediaQuery.removeListener(updateMatches);
      };
    }
  }, [breakpoint]);

  return isMobile;
}
