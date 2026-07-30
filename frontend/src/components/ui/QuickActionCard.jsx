import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';

const variantStyles = {
  blue: {
    bg: 'hover:bg-blue-50/60 dark:hover:bg-blue-950/30',
    border: 'hover:border-blue-300 dark:hover:border-blue-800',
    iconBg: 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400 border-blue-200 dark:border-blue-800',
    arrow: 'text-blue-600 dark:text-blue-400',
  },
  indigo: {
    bg: 'hover:bg-indigo-50/60 dark:hover:bg-indigo-950/30',
    border: 'hover:border-indigo-300 dark:hover:border-indigo-800',
    iconBg: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400 border-indigo-200 dark:border-indigo-800',
    arrow: 'text-indigo-600 dark:text-indigo-400',
  },
  emerald: {
    bg: 'hover:bg-emerald-50/60 dark:hover:bg-emerald-950/30',
    border: 'hover:border-emerald-300 dark:hover:border-emerald-800',
    iconBg: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
    arrow: 'text-emerald-600 dark:text-emerald-400',
  },
  amber: {
    bg: 'hover:bg-amber-50/60 dark:hover:bg-amber-950/30',
    border: 'hover:border-amber-300 dark:hover:border-amber-800',
    iconBg: 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400 border-amber-200 dark:border-amber-800',
    arrow: 'text-amber-600 dark:text-amber-400',
  },
  purple: {
    bg: 'hover:bg-purple-50/60 dark:hover:bg-purple-950/30',
    border: 'hover:border-purple-300 dark:hover:border-purple-800',
    iconBg: 'bg-purple-50 text-purple-600 dark:bg-purple-950 dark:text-purple-400 border-purple-200 dark:border-purple-800',
    arrow: 'text-purple-600 dark:text-purple-400',
  },
  rose: {
    bg: 'hover:bg-rose-50/60 dark:hover:bg-rose-950/30',
    border: 'hover:border-rose-300 dark:hover:border-rose-800',
    iconBg: 'bg-rose-50 text-rose-600 dark:bg-rose-950 dark:text-rose-400 border-rose-200 dark:border-rose-800',
    arrow: 'text-rose-600 dark:text-rose-400',
  },
};

export const QuickActionCard = ({
  title,
  description,
  icon: Icon,
  onClick,
  colorVariant = 'blue',
  badgeText,
}) => {
  const style = variantStyles[colorVariant] || variantStyles.blue;

  return (
    <motion.div
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`group relative p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-soft cursor-pointer transition-all duration-200 ${style.bg} ${style.border}`}
    >
      <div className="flex items-start justify-between">
        <div className={`p-2.5 rounded-xl border ${style.iconBg} transition-transform group-hover:scale-105`}>
          <Icon className="w-5 h-5" />
        </div>
        <ArrowUpRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${style.arrow}`} />
      </div>

      <div className="mt-3">
        <div className="flex items-center gap-2">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h4>
          {badgeText && (
            <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 uppercase">
              {badgeText}
            </span>
          )}
        </div>
        {description && (
          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

export default QuickActionCard;
