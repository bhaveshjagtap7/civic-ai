import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, ArrowRight, ShieldCheck, Building2 } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/officer/dashboard');
        if (res.status === 'success') {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const metrics = data?.metrics || { total_assigned: 0, pending_action: 0, in_progress: 0, resolved: 0 };
  const complaints = data?.recent_complaints || [];

  const getPriorityBadge = (prio) => {
    switch (prio) {
      case 'Critical':
        return 'bg-rose-500 text-white font-bold animate-pulse';
      case 'High':
        return 'bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200';
      case 'Medium':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200';
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200';
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Officer Header */}
      <div className="bg-gradient-to-r from-amber-600 via-amber-700 to-amber-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-amber-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Building2 className="w-4 h-4 text-amber-200" />
            {user?.department_name || 'Department Officer'} Desk
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Officer Dashboard & Workload
          </h1>
          <p className="mt-2 text-amber-100 text-sm max-w-xl leading-relaxed">
            Review complaints automatically routed to your department by Gemini AI. Update status, upload resolution proof photos, and meet civic SLA deadlines.
          </p>
        </div>

        <Link
          to="/officer/complaints"
          className="px-6 py-3.5 bg-white hover:bg-amber-50 text-amber-900 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
        >
          <CheckSquare className="w-5 h-5 text-amber-600" />
          <span>View Assigned Desk</span>
        </Link>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <CheckSquare className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Total Dept Complaints</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.total_assigned}</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400">
            <AlertTriangle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Pending Action</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.pending_action}</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">In Field Progress</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.in_progress}</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500">Resolved</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{metrics.resolved}</h3>
          </div>
        </div>
      </div>

      {/* Priority Complaints Table */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">High Priority Action Queue</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Sorted by critical urgency & SLA deadlines</p>
          </div>
          <Link to="/officer/complaints" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
            View All Desk Complaints &rarr;
          </Link>
        </div>

        <div className="space-y-4">
          {complaints.map((cmp) => (
            <div
              key={cmp.id}
              className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 hover:border-amber-300 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    #{cmp.complaint_number}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getPriorityBadge(cmp.priority)}`}>
                    {cmp.priority}
                  </span>
                  <span className="text-xs font-semibold text-slate-500">{cmp.category}</span>
                </div>
                <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{cmp.title}</h4>
                <p className="text-xs text-slate-500 truncate max-w-lg">{cmp.location || 'Location Not Specified'}</p>
              </div>

              <Link
                to={`/officer/complaint/${cmp.id}`}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs flex items-center gap-1 flex-shrink-0"
              >
                Inspect & Resolve <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default OfficerDashboard;
