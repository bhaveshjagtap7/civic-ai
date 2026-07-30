import React from 'react';
import AnimatedCounter from './AnimatedCounter';

const colorMap = {
  blue: { icon: 'bg-blue-50 text-blue-600', trend: 'text-blue-600', dot: 'bg-blue-500' },
  amber: { icon: 'bg-amber-50 text-amber-600', trend: 'text-amber-600', dot: 'bg-amber-500' },
  emerald: { icon: 'bg-green-50 text-green-600', trend: 'text-green-600', dot: 'bg-green-500' },
  rose: { icon: 'bg-red-50 text-red-600', trend: 'text-red-600', dot: 'bg-red-500' },
};

export const StatCard = ({ title, value, icon: Icon, trendText, colorVariant = 'blue', onClick }) => {
  const c = colorMap[colorVariant] || colorMap.blue;

  return (
    <div
      onClick={onClick}
      className={`bg-white border border-gray-200 rounded-xl p-5 transition-shadow hover:shadow-sm ${onClick ? 'cursor-pointer' : ''}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-0.5">
          <p className="text-xs font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">
            {typeof value === 'number' ? <AnimatedCounter value={value} /> : value}
          </p>
        </div>
        {Icon && (
          <div className={`p-2 rounded-lg ${c.icon} flex-shrink-0`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      {trendText && (
        <div className="mt-3 pt-3 border-t border-gray-100">
          <p className={`text-xs font-medium ${c.trend}`}>{trendText}</p>
        </div>
      )}
    </div>
  );
};

export default StatCard;
