import React from 'react';
import { CheckCircle2, Clock, FileCheck, ShieldAlert, ArrowRight } from 'lucide-react';
import Badge from './Badge';

const steps = [
  { key: 'Submitted', label: 'Submitted', desc: 'Complaint registered' },
  { key: 'Assigned', label: 'Assigned', desc: 'Officer assigned' },
  { key: 'In Progress', label: 'In Progress', desc: 'Field team dispatched' },
  { key: 'Resolved', label: 'Resolved', desc: 'Resolution verified' },
];

export const ComplaintTimeline = ({ currentStatus = 'Submitted', createdAt, title = "Complaint Status Timeline" }) => {
  const getStepState = (stepKey) => {
    if (currentStatus === 'Rejected') {
      return stepKey === 'Submitted' ? 'completed' : 'rejected';
    }

    const order = ['Submitted', 'Assigned', 'In Progress', 'Resolved'];
    const currentIndex = order.indexOf(currentStatus);
    const stepIndex = order.indexOf(stepKey);

    if (stepIndex < currentIndex) return 'completed';
    if (stepIndex === currentIndex) return 'active';
    return 'pending';
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl p-6 shadow-soft space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">{title}</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">Step-by-step municipal resolution progress</p>
        </div>
        <Badge variant={currentStatus}>{currentStatus}</Badge>
      </div>

      {currentStatus === 'Rejected' ? (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800/60 rounded-xl text-xs text-rose-700 dark:text-rose-300 flex items-center gap-2">
          <ShieldAlert className="w-5 h-5 flex-shrink-0" />
          <span>This complaint was reviewed and closed as rejected. Please check municipal notes for details.</span>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 relative pt-2">
          {steps.map((step, idx) => {
            const state = getStepState(step.key);

            return (
              <div
                key={step.key}
                className={`relative p-3.5 rounded-xl border transition-all text-xs space-y-1.5 ${state === 'active'
                    ? 'bg-blue-50/80 dark:bg-blue-950/60 border-blue-300 dark:border-blue-700 shadow-xs'
                    : state === 'completed'
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-900/60'
                      : 'bg-slate-50/50 dark:bg-slate-800/30 border-slate-200/60 dark:border-slate-800 text-slate-400'
                  }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`w-6 h-6 rounded-full font-extrabold text-[10px] flex items-center justify-center ${state === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : state === 'active'
                          ? 'bg-blue-600 text-white animate-pulse'
                          : 'bg-slate-200 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                      }`}
                  >
                    {state === 'completed' ? <CheckCircle2 className="w-3.5 h-3.5" /> : idx + 1}
                  </div>

                  {idx < steps.length - 1 && (
                    <ArrowRight className="w-3.5 h-3.5 text-slate-300 dark:text-slate-600 hidden sm:block" />
                  )}
                </div>

                <div>
                  <h4
                    className={`font-bold text-xs ${state === 'active'
                        ? 'text-blue-700 dark:text-blue-300'
                        : state === 'completed'
                          ? 'text-emerald-700 dark:text-emerald-300'
                          : 'text-slate-500 dark:text-slate-400'
                      }`}
                  >
                    {step.label}
                  </h4>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 leading-tight">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ComplaintTimeline;
