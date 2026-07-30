import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { CheckSquare, Clock, CheckCircle2, AlertTriangle, ArrowRight, Building2, ShieldAlert, Activity } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
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

  const metrics = data?.metrics || {
    total_assigned: 0,
    pending_action: 0,
    in_progress: 0,
    resolved: 0,
    high_priority_alerts: 0,
    department_performance: 100
  };
  const complaints = data?.recent_complaints || [];
  const timeline = data?.complaint_timeline || [];

  const highPriorityTickets = complaints.filter((c) => ['Critical', 'High'].includes(c.priority) && c.status !== 'Resolved');

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Officer Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-amber-600 via-amber-700 to-indigo-900 p-6 sm:p-8 text-white shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-amber-200 text-xs font-bold uppercase tracking-widest mb-2">
              <Building2 className="w-4 h-4 text-amber-200" />
              {user?.department_name || 'Department Officer'} Desk
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Officer Workload & Resolution Desk
            </h1>
            <p className="mt-2 text-amber-100/90 text-xs sm:text-sm max-w-xl leading-relaxed">
              Review complaints automatically routed to your department by Gemini AI. Update status, upload resolution proof photos, and meet civic SLA deadlines.
            </p>
          </div>

          <Link to="/officer/complaints">
            <Button variant="primary" icon={CheckSquare} className="bg-white text-amber-900 hover:bg-amber-50 shadow-none border-none">
              View Assigned Desk ({metrics.total_assigned})
            </Button>
          </Link>
        </div>
      </div>

      {/* High Priority Alerts Banner */}
      {metrics.high_priority_alerts > 0 && (
        <Card hoverEffect={false} className="bg-rose-500/10 dark:bg-rose-950/40 border-2 border-rose-500/40 p-4 sm:p-5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-rose-600 text-white rounded-xl shadow-xs flex-shrink-0 animate-pulse">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-rose-700 dark:text-rose-300">
                {metrics.high_priority_alerts} High Priority Alert Tickets Pending!
              </h4>
              <p className="text-xs text-rose-600/80 dark:text-rose-400 mt-0.5">
                Urgent municipal complaints require immediate inspection & field dispatch.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/officer/complaints')}
            className="flex-shrink-0"
          >
            Resolve Alerts
          </Button>
        </Card>
      )}

      {/* Metrics Row: Workload & Department Performance */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card hoverEffect glass className="p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Assigned</span>
            <CheckSquare className="w-4 h-4 text-blue-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={metrics.total_assigned} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Action</span>
            <AlertTriangle className="w-4 h-4 text-rose-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={metrics.pending_action} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">In Field Progress</span>
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={metrics.in_progress} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-5 space-y-1.5">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolved</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            <AnimatedCounter value={metrics.resolved} />
          </h3>
        </Card>

        <Card hoverEffect glass className="p-5 space-y-1.5 col-span-2 lg:col-span-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Dept SLA Rate</span>
            <Activity className="w-4 h-4 text-indigo-600" />
          </div>
          <h3 className="text-2xl font-extrabold text-indigo-600 dark:text-indigo-400 tracking-tight">
            {metrics.department_performance}%
          </h3>
        </Card>
      </div>

      {/* Main Grid: Priority Action Queue & Complaint Timeline */}
      <div className="grid md:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: High Priority & Recent Assigned Complaints */}
        <div className="md:col-span-2 space-y-6">
          <Card hoverEffect={false} className="space-y-6 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">Priority Action Queue</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Sorted by critical urgency & SLA deadlines</p>
              </div>
              <Link to="/officer/complaints" className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1">
                View All Desk &rarr;
              </Link>
            </div>

            <div className="space-y-4">
              {complaints.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-8">No assigned complaints in queue</p>
              ) : (
                complaints.slice(0, 6).map((cmp) => (
                  <Card
                    key={cmp.id}
                    hoverEffect
                    className="p-5 bg-slate-50/50 dark:bg-slate-800/40 border border-slate-200/70 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  >
                    <div className="space-y-1.5 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800">
                          #{cmp.complaint_number}
                        </span>
                        <Badge variant={cmp.priority}>{cmp.priority}</Badge>
                        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{cmp.category}</span>
                      </div>
                      <h4 className="font-bold text-base text-slate-900 dark:text-slate-100">{cmp.title}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-lg">
                        Citizen: {cmp.citizen_name} &bull; {cmp.location || 'Location Not Specified'}
                      </p>
                    </div>

                    <Link to={`/officer/complaint/${cmp.id}`}>
                      <Button variant="secondary" size="sm" icon={ArrowRight} className="bg-amber-600 hover:bg-amber-700 text-white">
                        Inspect & Resolve
                      </Button>
                    </Link>
                  </Card>
                ))
              )}
            </div>
          </Card>
        </div>

        {/* Right Column: Complaint Timeline & Activity Feed */}
        <div className="space-y-6">
          <Card hoverEffect={false} className="p-6 space-y-4">
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 flex items-center gap-2">
              <Activity className="w-4 h-4 text-amber-500" /> Department Activity Timeline
            </h3>

            <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-3 space-y-4 text-xs">
              {timeline.length === 0 ? (
                <p className="text-xs text-slate-400 pl-4">No recent status activity</p>
              ) : (
                timeline.map((act) => (
                  <div key={act.id} className="relative pl-5 space-y-1">
                    <div className="absolute -left-[7px] top-1 w-3 h-3 rounded-full bg-amber-500 ring-4 ring-white dark:ring-slate-900" />
                    <p className="font-bold text-slate-900 dark:text-slate-100">{act.complaint_number} updated to {act.status_to}</p>
                    <p className="text-slate-500 dark:text-slate-400 text-[11px]">{act.comment || 'Status updated by officer'}</p>
                    <span className="text-[10px] text-slate-400 block pt-0.5">
                      By {act.user_name || 'Officer'} &bull; {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))
              )}
            </div>
          </Card>
        </div>

      </div>
    </motion.div>
  );
};

export default OfficerDashboard;
