import { useEffect, useRef } from 'react';
import { useMotionValue, useSpring, useInView, useReducedMotion } from 'framer-motion';

export function NumberTicker({ value = 0, decimalPlaces = 0, className = '' }) {
  const ref = useRef(null);
  const motionValue = useMotionValue(0);
  const spring = useSpring(motionValue, { damping: 60, stiffness: 100 });
  const isInView = useInView(ref, { once: true, margin: '0px' });
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (!isInView) return;
    if (prefersReducedMotion) {
      motionValue.set(value);
    } else {
      motionValue.set(0);
      const t = setTimeout(() => motionValue.set(value), 50);
      return () => clearTimeout(t);
    }
  }, [isInView, value, motionValue, prefersReducedMotion]);

  useEffect(() => {
    return spring.on('change', v => {
      if (ref.current) {
        ref.current.textContent = new Intl.NumberFormat('zh-TW', {
          minimumFractionDigits: decimalPlaces,
          maximumFractionDigits: decimalPlaces,
        }).format(Number(v.toFixed(decimalPlaces)));
      }
    });
  }, [spring, decimalPlaces]);

  return <span ref={ref} className={className}>0</span>;
}
