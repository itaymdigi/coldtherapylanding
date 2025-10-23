import { useMemo } from 'react';
import { useApp } from '../contexts/AppContext';

const Background = () => {
  const { mousePosition } = useApp();

  // Check for reduced motion preference (important for mobile accessibility)
  const prefersReducedMotion = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  }, []);

  // Check if device is mobile for performance optimizations
  const isMobile = useMemo(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth <= 768 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }
    return false;
  }, []);

  // Memoize transform calculations to avoid recalculation on every render
  const transforms = useMemo(() => {
    if (prefersReducedMotion) {
      return {
        blob1: 'translate3d(0, 0, 0)',
        blob2: 'translate3d(0, 0, 0)',
      };
    }

    return {
      blob1: `translate3d(${mousePosition.x * (isMobile ? 0.01 : 0.02)}px, ${mousePosition.y * (isMobile ? 0.01 : 0.02)}px, 0)`,
      blob2: `translate3d(-${mousePosition.x * (isMobile ? 0.005 : 0.01)}px, -${mousePosition.y * (isMobile ? 0.005 : 0.01)}px, 0)`,
    };
  }, [mousePosition.x, mousePosition.y, prefersReducedMotion, isMobile]);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Base gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse pointer-events-none"></div>

      {/* Optimized floating blobs with reduced complexity for mobile */}
      <div
        className={`absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/15 rounded-full blur-3xl pointer-events-none ${prefersReducedMotion ? '' : 'animate-float'}`}
        style={{
          transform: transforms.blob1,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
          // Reduce blur on mobile for better performance
          filter: isMobile ? 'blur(2xl)' : 'blur(3xl)',
        }}
      ></div>

      <div
        className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/15 rounded-full blur-3xl pointer-events-none ${prefersReducedMotion ? '' : 'animate-float-delayed'}`}
        style={{
          transform: transforms.blob2,
          willChange: prefersReducedMotion ? 'auto' : 'transform',
          // Reduce blur on mobile for better performance
          filter: isMobile ? 'blur(2xl)' : 'blur(3xl)',
        }}
      ></div>

      {/* Single rotating element - disabled on mobile for performance */}
      {!isMobile && (
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/8 rounded-full blur-3xl animate-rotate pointer-events-none -translate-x-1/2 -translate-y-1/2"></div>
      )}
    </div>
  );
};

export default Background;
