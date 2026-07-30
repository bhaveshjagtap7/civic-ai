import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  PlusCircle,
  ArrowRight,
  CheckCircle2,
  Circle,
  PhoneCall,
} from 'lucide-react';
import Button from './Button';

export const RightSidebar = () => {
  const navigate = useNavigate();

  return (
    <div className="space-y-6">

      {/* 1. Submit Complaint Quick Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-xs">
          <PlusCircle className="w-5 h-5" />
        </div>

        <div className="space-y-1">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Submit Complaint
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
            Raise a new complaint and our AI will route it to the right department.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={ArrowRight}
          onClick={() => navigate('/submit-complaint')}
          className="w-full text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white justify-center py-2.5"
        >
          Submit Complaint &rarr;
        </Button>
      </div>

      {/* 2. Recent Notifications Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Recent Notifications
          </h3>
          <Link to="/profile" className="text-xs font-bold text-blue-600 hover:underline">
            View All
          </Link>
        </div>

        <div className="space-y-3.5 text-xs">
          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                Your complaint <span className="font-bold text-slate-900 dark:text-slate-100">#CIV-2026-1024</span> has been assigned to an officer.
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">2 mins ago</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                Complaint <span className="font-bold text-slate-900 dark:text-slate-100">#CIV-2026-1018</span> has been resolved successfully.
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">1 hour ago</span>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
            <div>
              <p className="text-slate-800 dark:text-slate-200 font-medium leading-snug">
                New update on complaint <span className="font-bold text-slate-900 dark:text-slate-100">#CIV-2026-1015</span>.
              </p>
              <span className="text-[10px] text-slate-400 block mt-0.5 font-normal">3 hours ago</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Profile Completion Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
            Profile Completion
          </h3>
          <span className="font-bold text-xs text-blue-600 dark:text-blue-400">
            80% Completed
          </span>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
          <div className="bg-blue-600 h-full rounded-full" style={{ width: '80%' }} />
        </div>

        {/* Checklist */}
        <div className="space-y-2 pt-1 text-xs">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Personal Information</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Contact Details</span>
          </div>
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300 font-medium">
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
            <span>Address Information</span>
          </div>
          <div className="flex items-center gap-2 text-slate-400 dark:text-slate-500 font-normal">
            <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />
            <span>Upload ID Proof</span>
          </div>
        </div>
      </div>

      {/* 4. Emergency Contacts Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-full bg-amber-50 dark:bg-amber-950 text-amber-500 flex items-center justify-center flex-shrink-0">
            <PhoneCall className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
              Emergency Contacts
            </h3>
            <p className="text-xs text-slate-400 font-medium">24/7 Helpline Numbers</p>
          </div>
        </div>

        {/* Numbers side by side */}
        <div className="grid grid-cols-2 gap-3 text-center py-1">
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 block">112</span>
            <span className="text-[11px] text-slate-500 font-medium">Police</span>
          </div>
          <div className="p-2.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
            <span className="font-extrabold text-lg text-slate-900 dark:text-slate-100 block">108</span>
            <span className="text-[11px] text-slate-500 font-medium">Ambulance</span>
          </div>
        </div>

        <Button
          variant="outline"
          size="md"
          onClick={() => navigate('/profile')}
          className="w-full text-xs font-bold justify-center"
        >
          View All Contacts
        </Button>
      </div>

    </div>
  );
};

export default RightSidebar;
