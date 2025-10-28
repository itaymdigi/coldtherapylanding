import { useEffect, useState } from 'react';
import { useApp } from '../contexts/AppContext';

const StatsCounter = ({ target, suffix = '', duration = 2000, decimals = 0 }) => {
  const [count, setCount] = useState(0);
  const [isAnimated, setIsAnimated] = useState(false);
  const { statsAnimationEnabled } = useApp();

  useEffect(() => {
    if (!statsAnimationEnabled) {
      // If animation is disabled, just display the final value immediately
      setCount(target);
      return;
    }

    if (!isAnimated || target === 0) return;

    const startTime = Date.now();
    const startValue = 0;
    const endValue = target;

    const animate = () => {
      const now = Date.now();
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Easing function for smooth animation (ease-out)
      const easeOut = 1 - (1 - progress) ** 3;

      const currentValue = startValue + (endValue - startValue) * easeOut;

      if (decimals > 0) {
        setCount(currentValue.toFixed(decimals));
      } else {
        setCount(Math.floor(currentValue));
      }

      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        if (decimals > 0) {
          setCount(endValue.toFixed(decimals));
        } else {
          setCount(endValue);
        }
      }
    };

    animate();
  }, [isAnimated, target, duration, decimals, statsAnimationEnabled]);

  useEffect(() => {
    if (!statsAnimationEnabled) {
      // If animation is disabled, set the final value immediately
      setCount(target);
      return;
    }

    // More reliable trigger: animate when component mounts and target is available
    if (target > 0 && !isAnimated) {
      const timer = setTimeout(() => {
        setIsAnimated(true);
      }, 100); // Small delay to ensure component is rendered

      return () => clearTimeout(timer);
    }
  }, [target, isAnimated, statsAnimationEnabled]);

  // Fallback: also use intersection observer for better UX (only if animation is enabled)
  useEffect(() => {
    if (isAnimated || !statsAnimationEnabled) return; // Don't set up observer if already animated or animation disabled

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isAnimated && target > 0) {
            setIsAnimated(true);
          }
        });
      },
      {
        threshold: 0.1, // Lower threshold for easier triggering
        rootMargin: '0px 0px -100px 0px' // Trigger earlier
      }
    );

    const element = document.getElementById(`stats-counter-${target}-${suffix}`);
    if (element) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [isAnimated, target, suffix, statsAnimationEnabled]);

  return (
    <span id={`stats-counter-${target}-${suffix}`} className="tabular-nums transition-all duration-300 ease-out">
      {count}{suffix}
    </span>
  );
};

export default StatsCounter;
