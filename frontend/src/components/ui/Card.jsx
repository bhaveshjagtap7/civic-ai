import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({
  children,
  className = '',
  hoverEffect = true,
  glass = false,
  onClick,
  ...props
}) => {
  const baseClasses = glass
    ? 'glass-card rounded-2xl p-6 transition-all duration-200'
    : 'bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-sm dark:shadow-slate-950/40 transition-all duration-200';

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -3, transition: { duration: 0.15, ease: 'easeOut' } }}
        onClick={onClick}
        className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={`${baseClasses} ${onClick ? 'cursor-pointer' : ''} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 dark:border-slate-800/80 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-bold text-slate-900 dark:text-slate-100 tracking-tight ${className}`}>
    {children}
  </h3>
);

export const CardDescription = ({ children, className = '' }) => (
  <p className={`text-xs text-slate-500 dark:text-slate-400 mt-0.5 ${className}`}>
    {children}
  </p>
);

export default Card;
