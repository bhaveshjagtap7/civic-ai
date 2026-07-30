import React, { useEffect, useState } from 'react';
import { motion, useSpring, useTransform } from 'framer-motion';

export const AnimatedCounter = ({ value, duration = 1.2, className = '' }) => {
  const numericValue = typeof value === 'number' ? value : parseInt(value, 10) || 0;
  const spring = useSpring(0, { duration: duration * 1000 });
  const display = useTransform(spring, (current) => Math.floor(current));
  const [currentVal, setCurrentVal] = useState(0);

  useEffect(() => {
    spring.set(numericValue);
  }, [numericValue, spring]);

  useEffect(() => {
    const unsubscribe = display.on('change', (latest) => setCurrentVal(latest));
    return () => unsubscribe();
  }, [display]);

  return <span className={className}>{currentVal.toLocaleString()}</span>;
};

export default AnimatedCounter;
