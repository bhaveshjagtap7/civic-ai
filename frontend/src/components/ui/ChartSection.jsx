import React from 'react';
import { ChevronDown } from 'lucide-react';

export const ComplaintStatusDonut = ({
  submitted = 0,
  inProgress = 1,
  resolved = 2,
  rejected = 1,
}) => {
  const total = submitted + inProgress + resolved + rejected || 4;
  const resolvedPct = Math.round((resolved / total) * 100) || 50;
  const pendingPct = Math.round((inProgress / total) * 100) || 25;
  const rejectedPct = Math.round((rejected / total) * 100) || 25;

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Complaint Status Overview
        </h3>
        <div className="flex items-center gap-1 text-xs text-slate-500 bg-slate-50 dark:bg-slate-800 px-2.5 py-1 rounded-xl border border-slate-200 dark:border-slate-700 cursor-pointer">
          <span>This Month</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </div>
      </div>

      {/* Donut Chart & Legend */}
      <div className="flex items-center justify-between gap-6 pt-2">
        {/* SVG Donut Ring */}
        <div className="relative w-36 h-36 flex items-center justify-center flex-shrink-0">
          <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
            <circle cx="50" cy="50" r="38" stroke="#E2E8F0" strokeWidth="12" fill="none" />
            <circle cx="50" cy="50" r="38" stroke="#22C55E" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="119" />
            <circle cx="50" cy="50" r="38" stroke="#F59E0B" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="178" />
            <circle cx="50" cy="50" r="38" stroke="#EF4444" strokeWidth="12" fill="none" strokeDasharray="238" strokeDashoffset="238" />
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 leading-none">{total}</span>
            <span className="text-[10px] font-semibold text-slate-400 mt-0.5">Total</span>
          </div>
        </div>

        {/* Donut Legend */}
        <div className="space-y-3.5 flex-1 text-xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Resolved</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">{resolved} ({resolvedPct}%)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Pending</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">{inProgress} ({pendingPct}%)</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="font-semibold text-slate-700 dark:text-slate-300">Rejected</span>
            </div>
            <span className="font-bold text-slate-900 dark:text-slate-100">{rejected} ({rejectedPct}%)</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintStatusDonut;
