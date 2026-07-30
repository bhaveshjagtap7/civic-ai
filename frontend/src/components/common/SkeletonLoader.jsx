import React from 'react';

const SkeletonLoader = ({ count = 3, type = 'card' }) => {
  return (
    <div className="space-y-4 w-full">
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white dark:bg-slate-900 rounded-2xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4"
        >
          {type === 'card' && (
            <div className="space-y-3">
              <div className="h-4 animate-shimmer rounded-lg w-1/4" />
              <div className="h-8 animate-shimmer rounded-xl w-1/2" />
              <div className="h-3 animate-shimmer rounded-lg w-3/4" />
            </div>
          )}
          {type === 'table' && (
            <div className="flex items-center justify-between gap-4">
              <div className="h-4 animate-shimmer rounded-lg w-1/6" />
              <div className="h-4 animate-shimmer rounded-lg w-1/4" />
              <div className="h-4 animate-shimmer rounded-lg w-1/5" />
              <div className="h-4 animate-shimmer rounded-lg w-1/12" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
