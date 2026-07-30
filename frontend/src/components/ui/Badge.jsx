import React from 'react';

export const Badge = ({
  children,
  variant = 'default',
  size = 'md',
  dot = true,
  className = '',
}) => {
  const variants = {
    submitted: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
    inProgress: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    resolved: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
    rejected: 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
    
    // Priority badges
    low: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    medium: 'bg-sky-50 text-sky-700 dark:bg-sky-950/60 dark:text-sky-300 border-sky-200 dark:border-sky-800/60',
    high: 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
    critical: 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300 border-rose-300 dark:border-rose-800',

    // Generic
    primary: 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800',
    secondary: 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 border-indigo-200 dark:border-indigo-800',
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
  };

  const dotColors = {
    submitted: 'bg-blue-500',
    inProgress: 'bg-amber-500',
    resolved: 'bg-emerald-500',
    rejected: 'bg-rose-500',
    low: 'bg-slate-400',
    medium: 'bg-sky-500',
    high: 'bg-amber-500',
    critical: 'bg-rose-600 animate-pulse',
    primary: 'bg-blue-500',
    secondary: 'bg-indigo-500',
    default: 'bg-slate-400',
  };

  const sizes = {
    sm: 'text-[10px] px-2 py-0.5 gap-1 font-semibold',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-bold',
    lg: 'text-sm px-3 py-1.5 gap-2 font-bold',
  };

  const normalizedVariant = String(variant).toLowerCase().replace(/\s+/g, '');
  const activeVariantKey = variants[normalizedVariant] ? normalizedVariant : 'default';

  return (
    <span
      className={`inline-flex items-center rounded-full border tracking-wide uppercase ${variants[activeVariantKey]} ${sizes[size]} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${dotColors[activeVariantKey]}`} />}
      {children}
    </span>
  );
};

export default Badge;
