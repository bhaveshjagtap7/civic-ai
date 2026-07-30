import React from 'react';
import { Home, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const PageHeader = ({ title, subtitle, breadcrumbs = [], action }) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-200">
      <div className="space-y-1">
        {/* Breadcrumb Links */}
        <div className="flex items-center gap-1.5 text-xs text-slate-500 mb-1">
          <Link to="/" className="hover:text-slate-900 flex items-center gap-1 transition-colors font-medium">
            <Home className="w-3.5 h-3.5" />
          </Link>
          {breadcrumbs.map((b, i) => (
            <React.Fragment key={i}>
              <ChevronRight className="w-3 h-3 text-slate-400" />
              {b.link ? (
                <Link to={b.link} className="hover:text-slate-900 transition-colors font-medium">{b.label}</Link>
              ) : (
                <span className="text-slate-900 font-bold">{b.label}</span>
              )}
            </React.Fragment>
          ))}
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs sm:text-sm text-slate-500 font-medium">{subtitle}</p>}
      </div>

      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  );
};

export default PageHeader;
