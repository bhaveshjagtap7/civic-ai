import React from 'react';
import { motion } from 'framer-motion';

export const Card = ({ children, className = '', hoverEffect = false, onClick, ...props }) => {
  const base = 'bg-white border border-slate-200 rounded-2xl p-6 shadow-sm transition-all duration-200';
  const hover = hoverEffect ? 'hover:shadow-md hover:border-slate-300 cursor-pointer' : '';

  if (hoverEffect) {
    return (
      <motion.div
        whileHover={{ y: -2, transition: { duration: 0.15 } }}
        onClick={onClick}
        className={`${base} ${hover} ${className}`}
        {...props}
      >
        {children}
      </motion.div>
    );
  }

  return (
    <div onClick={onClick} className={`${base} ${className}`} {...props}>
      {children}
    </div>
  );
};

export const CardHeader = ({ children, className = '' }) => (
  <div className={`flex items-center justify-between pb-4 mb-4 border-b border-slate-100 ${className}`}>
    {children}
  </div>
);

export const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-extrabold text-slate-900 tracking-tight ${className}`}>{children}</h3>
);

export default Card;
