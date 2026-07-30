import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="animate-pulse bg-slate-200 dark:bg-slate-800 rounded-2xl p-6 border border-slate-200 dark:border-slate-700/50"
        >
          {type === 'card' && (
            <div className="space-y-3">
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-6 bg-slate-300 dark:bg-slate-700 rounded w-3/4"></div>
              <div className="h-4 bg-slate-300 dark:bg-slate-700 rounded w-1/2"></div>
            </div>
          )}
          {type === 'table' && (
            <div className="flex items-center justify-between gap-4">
              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/6"></div>
              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/4"></div>
              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/5"></div>
              <div className="h-5 bg-slate-300 dark:bg-slate-700 rounded w-1/12"></div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
