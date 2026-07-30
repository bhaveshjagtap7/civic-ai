import React from 'react';
import { Link } from 'react-router-dom';
import Card from './Card';
import {
  User,
  PhoneCall,
  HelpCircle,
  Sparkles,
  Flame,
  Droplets,
  Zap,
  Shield,
  Trash2,
  ChevronRight,
  CheckCircle2,
} from 'lucide-react';

export const ProfileCompletionCard = ({ completionPct = 50, user }) => {
  return (
    <Card hoverEffect={false} className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <User className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Profile Completion
        </h3>
        <span className="font-extrabold text-xs text-blue-600 dark:text-blue-400">
          {completionPct}%
        </span>
      </div>

      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-blue-600 to-indigo-600 h-full rounded-full transition-all duration-500"
          style={{ width: `${completionPct}%` }}
        />
      </div>

      <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-normal">
        {completionPct < 100
          ? "Add complete phone & address in your profile to receive instant SMS updates on complaint resolution."
          : "Your citizen profile is fully verified for priority SMS alerts."}
      </p>

      {completionPct < 100 && (
        <Link
          to="/profile"
          className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 pt-1"
        >
          Complete Profile Now <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      )}
    </Card>
  );
};

export const EmergencyContactsCard = () => {
  const contacts = [
    { title: 'Civic Helplines', number: '1916 / 1800-22-3000', icon: PhoneCall, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/60' },
    { title: 'Water Leakage & Supply', number: '1916-2', icon: Droplets, color: 'text-sky-600 bg-sky-50 dark:bg-sky-950/60' },
    { title: 'Electricity Breakdown', number: '1912', icon: Zap, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/60' },
    { title: 'Fire & Rescue', number: '101', icon: Flame, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/60' },
    { title: 'Police / Law Safety', number: '112 / 100', icon: Shield, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/60' },
    { title: 'Waste Management', number: '1800-11-0033', icon: Trash2, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60' },
  ];

  return (
    <Card hoverEffect={false} className="p-5 space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <PhoneCall className="w-4 h-4 text-rose-600 dark:text-rose-400" />
          Emergency Contacts
        </h3>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400">
          24/7 Helpline
        </span>
      </div>

      <div className="space-y-2.5">
        {contacts.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.title}
              className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50/70 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 text-xs"
            >
              <div className="flex items-center gap-2.5">
                <div className={`p-1.5 rounded-lg ${c.color}`}>
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{c.title}</span>
              </div>
              <a
                href={`tel:${c.number.split('/')[0].trim()}`}
                className="font-extrabold text-blue-600 dark:text-blue-400 hover:underline text-[11px]"
              >
                {c.number}
              </a>
            </div>
          );
        })}
      </div>
    </Card>
  );
};

export const QuickHelpCard = () => {
  return (
    <Card hoverEffect={false} className="p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
          <HelpCircle className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
          Quick Help & Guidance
        </h3>
      </div>

      <div className="space-y-2 text-xs">
        <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/30 rounded-xl border border-indigo-100 dark:border-indigo-900/40">
          <h4 className="font-bold text-indigo-900 dark:text-indigo-200 text-xs">How AI Routing Works?</h4>
          <p className="text-[11px] text-indigo-700/80 dark:text-indigo-300/80 mt-1 leading-snug">
            Gemini AI evaluates complaint details, auto-detects department jurisdiction (Roads, Water, Sanitation), and sets priority.
          </p>
        </div>

        <div className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
          <p className="font-bold text-slate-800 dark:text-slate-200">Resolution SLA Timelines:</p>
          <ul className="text-[11px] text-slate-500 dark:text-slate-400 space-y-1 list-disc pl-4">
            <li>Critical Safety Issues: <b>Within 24 Hours</b></li>
            <li>High Priority Potholes: <b>48 Hours</b></li>
            <li>Standard Garbage & Streetlight: <b>3-5 Days</b></li>
          </ul>
        </div>
      </div>
    </Card>
  );
};

export const AISuggestionsCard = () => {
  return (
    <Card hoverEffect={false} className="p-5 space-y-3 bg-gradient-to-br from-blue-900 via-indigo-900 to-slate-900 text-white border-none shadow-floating">
      <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
        <h3 className="font-extrabold text-xs uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4 text-amber-400" />
          AI Recommendations
        </h3>
        <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/10 text-blue-200">
          Smart Tips
        </span>
      </div>

      <div className="space-y-2.5 text-xs text-blue-100/90">
        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <b>Attach photo proofs:</b> Complaints with clear images are resolved 40% faster by field officers.
          </p>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="leading-snug">
            <b>Use Voice Complaint:</b> Speak in your native language for hands-free filing.
          </p>
        </div>
      </div>
    </Card>
  );
};
