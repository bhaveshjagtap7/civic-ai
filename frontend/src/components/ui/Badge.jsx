import React from 'react';

export const Badge = ({ children, variant = 'default', size = 'md', dot = true, className = '' }) => {
  const variants = {
    // Status
    submitted: 'bg-blue-50 text-blue-700 border-blue-200',
    assigned: 'bg-amber-50 text-amber-700 border-amber-200',
    inprogress: 'bg-amber-50 text-amber-700 border-amber-200',
    'in progress': 'bg-amber-50 text-amber-700 border-amber-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
    rejected: 'bg-red-50 text-red-700 border-red-200',
    // Priority
    low: 'bg-gray-100 text-gray-600 border-gray-200',
    medium: 'bg-blue-50 text-blue-700 border-blue-200',
    high: 'bg-amber-50 text-amber-700 border-amber-200',
    critical: 'bg-red-100 text-red-700 border-red-300',
    // Roles
    citizen: 'bg-blue-50 text-blue-700 border-blue-200',
    officer: 'bg-amber-50 text-amber-700 border-amber-200',
    admin: 'bg-purple-50 text-purple-700 border-purple-200',
    // Default
    primary: 'bg-blue-50 text-blue-700 border-blue-200',
    secondary: 'bg-gray-100 text-gray-600 border-gray-200',
    default: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const dotColors = {
    submitted: 'bg-blue-500', assigned: 'bg-amber-500', inprogress: 'bg-amber-500',
    'in progress': 'bg-amber-500', resolved: 'bg-green-500', rejected: 'bg-red-500',
    low: 'bg-gray-400', medium: 'bg-blue-500', high: 'bg-amber-500',
    critical: 'bg-red-600', citizen: 'bg-blue-500', officer: 'bg-amber-500',
    admin: 'bg-purple-500', primary: 'bg-blue-500', secondary: 'bg-gray-400',
    default: 'bg-gray-400',
  };

  const sizes = {
    sm: 'text-[10px] px-1.5 py-0.5 gap-1',
    md: 'text-[11px] px-2 py-0.5 gap-1.5',
    lg: 'text-xs px-2.5 py-1 gap-2',
  };

  const key = String(variant).toLowerCase().replace(/\s+/g, ' ').trim();
  const vKey = variants[key] ? key : 'default';

  return (
    <span className={`inline-flex items-center rounded-full border font-semibold uppercase tracking-wide ${variants[vKey]} ${sizes[size]} ${className}`}>
      {dot && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[vKey]}`} />}
      {children}
    </span>
  );
};

export default Badge;
