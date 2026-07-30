import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Building2, FileText, CheckCircle2, BarChart3, Shield, Activity, Star, Clock, AlertTriangle, Sparkles, UserCheck } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const [dashRes, analyticsRes] = await Promise.all([
          api.get('/admin/dashboard'),
          api.get('/analytics')
        ]);
        if (dashRes.status === 'success') {
          setData(dashRes.data);
        }
        if (analyticsRes.status === 'success') {
          setAnalyticsData(analyticsRes.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const counts = data?.counts || {
    citizens: 0,
    officers: 0,
    departments: 0,
    total_complaints: 0,
    resolved_complaints: 0,
    pending_complaints: 0,
    rejected_complaints: 0,
    resolution_rate: 100
  };
  const workload = data?.department_workload || [];
  const recentUsers = data?.recent_users || [];
  const liveActivity = data?.live_activity_feed || [];
  const feedbackSummary = data?.feedback_summary || { avg_rating: 4.8, total_reviews: 0, recent_reviews: [] };
  const systemHealth = data?.system_health || {};

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Admin Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-purple-700 via-indigo-800 to-blue-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-purple-200 text-xs font-bold uppercase tracking-widest mb-2">
              <Shield className="w-4 h-4 text-amber-300" />
              Central Municipal Governance
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Admin Platform Control & Overview
            </h1>
            <p className="mt-2 text-purple-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Monitor platform health, citizen complaint volume, department SLA efficiency, and AI routing performance across all municipal sectors.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Link to="/admin/analytics">
              <Button variant="primary" icon={BarChart3} className="bg-white text-purple-900 hover:bg-purple-50 shadow-none border-none">
                Full Analytics & SLA Reports
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Row: Users, Officers, Complaints, Resolution Rate */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Citizens</span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 dark:bg-blue-950/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={counts.citizens} />
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Registered Citizens</span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Field Officers</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={counts.officers} />
          </h3>
          <span className="text-[11px] text-slate-400 font-medium">Active Department Staff</span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Complaints</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={counts.total_complaints} />
          </h3>
          <span className="text-[11px] text-purple-600 dark:text-purple-400 font-semibold">{counts.pending_complaints} Pending Action</span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolution Rate</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 tracking-tight">
            {counts.resolution_rate}%
          </h3>
          <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">{counts.resolved_complaints} Resolved SLA</span>
        </Card>
      </div>

      {/* System Health & AI Status Card */}
      <Card hoverEffect={false} className="p-6 bg-gradient-to-r from-slate-900 via-slate-900 to-indigo-950 text-white space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-sm text-white">Gemini AI Auto-Routing & System Health</h3>
              <p className="text-[11px] text-slate-400">Live operational status and SLA thresholds</p>
            </div>
          </div>

          <Badge variant="resolved" className="bg-emerald-500/20 text-emerald-300 border-emerald-500/30">
            System Operational
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">AI Routing Engine</span>
            <span className="font-bold text-emerald-400 mt-0.5 block capitalize">{systemHealth.ai_auto_routing || 'Enabled'}</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Critical SLA Threshold</span>
            <span className="font-bold text-rose-400 mt-0.5 block">{systemHealth.sla_critical_hours || 24} Hours</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">High Priority SLA</span>
            <span className="font-bold text-rose-300 mt-0.5 block">{systemHealth.sla_high_hours || 48} Hours</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medium Priority SLA</span>
            <span className="font-bold text-amber-300 mt-0.5 block">{systemHealth.sla_medium_hours || 72} Hours</span>
          </div>

          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Low Priority SLA</span>
            <span className="font-bold text-slate-300 mt-0.5 block">{systemHealth.sla_low_hours || 120} Hours</span>
          </div>
        </div>
      </Card>

      {/* Main Grid 1: Department Analytics Workload & Live Activity Feed */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Department Analytics */}
        <Card hoverEffect={false} className="md:col-span-2 p-6 sm:p-8 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Department Analytics & Workload</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Assigned complaints vs resolution completion percentage</p>
            </div>
            <Link to="/admin/departments" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
              Manage Departments &rarr;
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <th className="py-3 px-4">Department Name</th>
                  <th className="py-3 px-4 text-center">Assigned</th>
                  <th className="py-3 px-4 text-center">Resolved</th>
                  <th className="py-3 px-4 text-right">Completion Rate</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                {workload.map((dept, idx) => {
                  const total = parseInt(dept.total_complaints) || 0;
                  const resolved = parseInt(dept.resolved_count) || 0;
                  const pct = total > 0 ? Math.round((resolved / total) * 100) : 100;
                  return (
                    <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
                      <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-slate-100">{dept.name}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">{total}</td>
                      <td className="py-3.5 px-4 text-center font-semibold text-emerald-600 dark:text-emerald-400">{resolved}</td>
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <div className="w-24 bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                            <div className="bg-purple-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                          </div>
                          <span className="font-bold text-slate-800 dark:text-slate-200 w-8">{pct}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Card>

        {/* Right Col: Live Activity Audit Feed */}
        <Card hoverEffect={false} className="p-6 space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Activity className="w-4 h-4 text-purple-600" /> Live Audit Feed
            </h3>
            <span className="text-[10px] text-emerald-500 font-bold flex items-center gap-1">
              &bull; Streaming
            </span>
          </div>

          <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-4 text-xs max-h-96 overflow-y-auto">
            {liveActivity.length === 0 ? (
              <p className="text-xs text-slate-400 pl-4">No audit logs recorded</p>
            ) : (
              liveActivity.map((log) => (
                <div key={log.id} className="relative pl-5 space-y-1">
                  <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-purple-600 ring-4 ring-white dark:ring-slate-900" />
                  <p className="font-bold text-slate-900 dark:text-slate-100">
                    #{log.complaint_number} &rarr; <span className="text-purple-600 dark:text-purple-400">{log.status_to}</span>
                  </p>
                  <p className="text-slate-500 dark:text-slate-400 text-[11px] leading-snug">{log.comment}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5">
                    By {log.user_name || 'System'} ({log.user_role || 'Auto'}) &bull; {new Date(log.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

      {/* Main Grid 2: Recent Registrations & Feedback Summary */}
      <div className="grid md:grid-cols-2 gap-6">
        
        {/* Recent Registrations */}
        <Card hoverEffect={false} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">Recent User Registrations</h3>
            <Link to="/admin/users" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
              View All Users &rarr;
            </Link>
          </div>

          <div className="space-y-3">
            {recentUsers.map((u) => (
              <div key={u.id} className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 flex items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-slate-900 dark:text-slate-100">{u.name}</p>
                  <p className="text-[11px] text-slate-500">{u.email}</p>
                </div>
                <div className="text-right">
                  <Badge variant={u.role}>{u.role}</Badge>
                  <span className="text-[10px] text-slate-400 block mt-1">
                    {new Date(u.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Citizen Feedback Summary */}
        <Card hoverEffect={false} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 tracking-tight">Citizen Service Feedback</h3>
            <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
              <Star className="w-4 h-4 fill-amber-400" />
              <span>{feedbackSummary.avg_rating} / 5</span>
              <span className="text-[10px] text-slate-400 font-normal">({feedbackSummary.total_reviews} reviews)</span>
            </div>
          </div>

          <div className="space-y-3">
            {feedbackSummary.recent_reviews.length === 0 ? (
              <p className="text-xs text-slate-400 text-center py-6">No service feedback reviews yet</p>
            ) : (
              feedbackSummary.recent_reviews.map((fb) => (
                <div key={fb.id} className="p-3 bg-slate-50/70 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">#{fb.complaint_number} - {fb.citizen_name}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400" /> {fb.rating} / 5
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic">"{fb.feedback_notes || 'No review comments provided.'}"</p>
                </div>
              ))
            )}
          </div>
        </Card>

      </div>

    </motion.div>
  );
};

export default AdminDashboard;
