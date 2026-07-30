import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { PlusCircle, FileText, CheckCircle2, Clock, AlertTriangle, ArrowRight, Sparkles, MapPin, Shield } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const CitizenDashboard = () => {
  const { user } = useAuth();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await api.get('/complaints?limit=5');
        if (res.status === 'success') {
          setComplaints(res.data.complaints);
        }
      } catch (err) {
        console.error("Error loading citizen complaints", err);
      } finally {
        setLoading(false);
      }
    };
    fetchComplaints();
  }, []);

  const totalSubmitted = complaints.length;
  const resolvedCount = complaints.filter((c) => c.status === 'Resolved').length;
  const activeCount = complaints.filter((c) => ['Submitted', 'Assigned', 'In Progress'].includes(c.status)).length;

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Resolved':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'In Progress':
        return 'bg-brand-100 text-brand-800 dark:bg-brand-900/40 dark:text-brand-300 border-brand-200 dark:border-brand-800';
      case 'Assigned':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Rejected':
        return 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300 border-rose-200 dark:border-rose-800';
      default:
        return 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300 border-amber-200 dark:border-amber-800';
    }
  };

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
    <div className="space-y-8">
      
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-600 via-brand-700 to-indigo-700 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-brand-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <Shield className="w-4 h-4 text-amber-300" />
              Citizen Municipal Service Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Welcome back, {user?.name || 'Citizen'}!
            </h1>
            <p className="mt-2 text-brand-100 text-sm max-w-xl leading-relaxed">
              Lodge civic issues in seconds. Our Gemini AI engine classifies your complaint, routes it to the right department officer, and updates status in real-time.
            </p>
          </div>

          <Link
            to="/submit-complaint"
            className="px-6 py-3.5 bg-white hover:bg-brand-50 text-brand-700 font-bold rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 flex-shrink-0"
          >
            <PlusCircle className="w-5 h-5 text-brand-600" />
            <span>Submit New Complaint</span>
          </Link>
        </div>

        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60 dark:text-brand-400">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Total Filed</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{totalSubmitted}</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Active In Progress</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{activeCount}</h3>
          </div>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs flex items-center gap-4">
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">Resolved</p>
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 mt-0.5">{resolvedCount}</h3>
          </div>
        </div>
      </div>

      {/* Recent Complaints Table / Cards */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">My Recent Complaints</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Track status updates and officer progress</p>
          </div>
          <Link
            to="/complaints"
            className="text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
          >
            View All &rarr;
          </Link>
        </div>

        {loading ? (
          <SkeletonLoader count={3} type="card" />
        ) : complaints.length === 0 ? (
          <div className="p-12 text-center border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl space-y-3">
            <Sparkles className="w-10 h-10 text-brand-400 mx-auto" />
            <h4 className="font-bold text-slate-700 dark:text-slate-300">No complaints submitted yet</h4>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              If you see a pothole, water leak, or uncollected garbage, file a ticket now for immediate AI department assignment!
            </p>
            <Link
              to="/submit-complaint"
              className="inline-flex items-center gap-2 px-4 py-2 bg-brand-600 text-white font-semibold rounded-xl text-xs"
            >
              <PlusCircle className="w-4 h-4" /> Submit First Complaint
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((cmp) => (
              <div
                key={cmp.id}
                className="p-5 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 bg-slate-50/50 dark:bg-slate-900/40 hover:border-brand-300 dark:hover:border-slate-600 transition-all space-y-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
                      #{cmp.complaint_number}
                    </span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${getPriorityBadge(cmp.priority)}`}>
                      {cmp.priority} Priority
                    </span>
                    <span className="text-xs text-slate-400">&bull;</span>
                    <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{cmp.category}</span>
                  </div>

                  <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusBadge(cmp.status)}`}>
                    {cmp.status}
                  </span>
                </div>

                <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{cmp.title}</h4>

                {cmp.ai_summary && (
                  <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-xs text-slate-600 dark:text-slate-300 flex items-start gap-2">
                    <Sparkles className="w-4 h-4 text-brand-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-brand-600 dark:text-brand-400">AI Summary: </span>
                      {cmp.ai_summary}
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-slate-700/40">
                  <div className="flex items-center gap-1.5 truncate max-w-xs">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{cmp.location || 'Location Not Specified'}</span>
                  </div>

                  <Link
                    to={`/complaints/${cmp.id}`}
                    className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                  >
                    View Details <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CitizenDashboard;
