import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  CheckSquare,
  Clock,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
  Activity,
  Calendar,
  Search,
} from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import { motion } from 'framer-motion';

const OfficerDashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.get('/officer/dashboard');
        if (res.status === 'success') {
          setData(res.data);
        }
      } catch (err) {
        console.error("Officer dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const metrics = data?.metrics || {
    total_assigned: 18,
    pending_action: 5,
    in_progress: 8,
    resolved: 5,
    high_priority_alerts: 2,
    department_performance: 94,
  };

  const rawComplaints = data?.recent_complaints || [
    {
      id: 101,
      complaint_number: 'CIV-2026-1024',
      title: 'Deep Road Pothole near Central Market',
      category: 'Road Maintenance',
      citizen_name: 'Rahul Sharma',
      location: 'Sector 4, Central Avenue',
      priority: 'Critical',
      status: 'In Progress',
      created_at: '2026-07-30',
    },
    {
      id: 102,
      complaint_number: 'CIV-2026-1022',
      title: 'Water Supply Pipeline Breakage',
      category: 'Water Supply',
      citizen_name: 'Priya Singh',
      location: 'Block C, Green Park',
      priority: 'High',
      status: 'Assigned',
      created_at: '2026-07-29',
    },
    {
      id: 103,
      complaint_number: 'CIV-2026-1019',
      title: 'Garbage Collection Blocked',
      category: 'Sanitation',
      citizen_name: 'Amit Verma',
      location: 'Street 12, West Zone',
      priority: 'Medium',
      status: 'Submitted',
      created_at: '2026-07-28',
    },
    {
      id: 104,
      complaint_number: 'CIV-2026-1015',
      title: 'Street Light Faulty Wiring',
      category: 'Electrical',
      citizen_name: 'Suresh Kumar',
      location: 'Main Road, Ward 8',
      priority: 'High',
      status: 'In Progress',
      created_at: '2026-07-27',
    },
    {
      id: 105,
      complaint_number: 'CIV-2026-1010',
      title: 'Stormwater Drain Overflow',
      category: 'Drainage',
      citizen_name: 'Neha Gupta',
      location: 'Sector 11 Crossing',
      priority: 'Medium',
      status: 'Assigned',
      created_at: '2026-07-26',
    },
  ];

  const filteredComplaints = rawComplaints.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.title.toLowerCase().includes(q) ||
      c.complaint_number.toLowerCase().includes(q) ||
      c.category.toLowerCase().includes(q) ||
      (c.location && c.location.toLowerCase().includes(q))
    );
  });

  const timeline = data?.complaint_timeline || [
    { id: 1, complaint_number: 'CIV-2026-1024', status_to: 'In Progress', comment: 'Field team dispatched for road asphalt filling.', created_at: new Date().toISOString() },
    { id: 2, complaint_number: 'CIV-2026-1018', status_to: 'Resolved', comment: 'Garbage cleared and photo proof verified.', created_at: new Date(Date.now() - 3600000).toISOString() },
    { id: 3, complaint_number: 'CIV-2026-1015', status_to: 'In Progress', comment: 'Electrician team inspecting junction box.', created_at: new Date(Date.now() - 7200000).toISOString() },
  ];

  const todaySchedule = [
    { time: '09:30 AM', task: 'Morning Field Inspection - Sector 4 Roadworks', status: 'Completed' },
    { time: '11:30 AM', task: 'SLA Review with Ward Commissioner', status: 'In Progress' },
    { time: '02:30 PM', task: 'Water Pipeline Inspection & Photo Verification', status: 'Pending' },
    { time: '04:30 PM', task: 'Daily Resolution Sign-Offs & AI Log Review', status: 'Pending' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      {/* 1. Page Header */}
      <PageHeader
        title={`Officer Desk — ${user?.name || 'Field Officer'}`}
        subtitle={`Department: ${user?.department_name || 'Municipal Operations'}. Inspect assigned civic issues and complete SLA targets.`}
        breadcrumbs={[{ label: 'Officer Desk' }]}
        action={
          <Link to="/officer/complaints">
            <Button variant="primary" size="md" icon={CheckSquare}>
              Assigned Desk ({metrics.total_assigned})
            </Button>
          </Link>
        }
      />

      {/* 2. High Priority SLA Alert Banner */}
      {metrics.high_priority_alerts > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-rose-600 text-white rounded-xl flex-shrink-0">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h4 className="font-extrabold text-xs sm:text-sm text-rose-900">
                {metrics.high_priority_alerts} High Priority SLA Alerts Pending
              </h4>
              <p className="text-xs text-rose-700/80 mt-0.5">
                Critical civic issues require immediate field dispatch & resolution upload.
              </p>
            </div>
          </div>
          <Button
            variant="danger"
            size="sm"
            onClick={() => navigate('/officer/complaints')}
            className="flex-shrink-0 text-xs font-bold"
          >
            Resolve Urgent Alerts
          </Button>
        </div>
      )}

      {/* 3. Stat Cards Row (Exact 110px Height, Equal Spacing, Compact Padded White Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Card 1: Today's Assigned */}
        <div className="h-[110px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Today's Assigned</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              <AnimatedCounter value={metrics.total_assigned} />
            </h3>
            <span className="text-[10px] font-bold text-emerald-600">+3 Today</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center flex-shrink-0">
            <CheckSquare className="w-5 h-5" />
          </div>
        </div>

        {/* Card 2: Pending Tasks */}
        <div className="h-[110px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">Pending Action</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              <AnimatedCounter value={metrics.pending_action} />
            </h3>
            <span className="text-[10px] font-bold text-rose-600">Action Required</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
        </div>

        {/* Card 3: In Field Progress */}
        <div className="h-[110px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">In Progress</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              <AnimatedCounter value={metrics.in_progress} />
            </h3>
            <span className="text-[10px] font-bold text-amber-600">Active SLA</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center flex-shrink-0">
            <Clock className="w-5 h-5" />
          </div>
        </div>

        {/* Card 4: Department Performance */}
        <div className="h-[110px] bg-white border border-gray-200 rounded-2xl p-4 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider block">SLA Resolution Rate</span>
            <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              {metrics.department_performance}%
            </h3>
            <span className="text-[10px] font-bold text-emerald-600">Target &gt; 90%</span>
          </div>
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center flex-shrink-0">
            <Activity className="w-5 h-5" />
          </div>
        </div>
      </div>

      {/* 4. Main Content Grid (Left 2/3 Table + Right 1/3 Panels) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left Column (2/3 Width): Priority Action Queue Table */}
        <div className="lg:col-span-2 space-y-6">

          {/* Table Container Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-4">
            
            {/* Header + Search Bar (Exact 44px Height) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-extrabold text-sm text-slate-900 tracking-tight">
                  Priority Assigned Complaints
                </h3>
                <p className="text-xs text-slate-500">
                  Issues routed to your desk by Gemini AI
                </p>
              </div>

              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search desk complaints..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-3.5 h-[44px] bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-600"
                />
              </div>
            </div>

            {/* Custom Table with Exact 56px Row Height & Zebra Rows */}
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase text-[10px] tracking-wider sticky top-0">
                      <th className="py-3 px-4">Complaint ID</th>
                      <th className="py-3 px-4">Issue & Location</th>
                      <th className="py-3 px-4">Priority</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                    {filteredComplaints.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="h-[56px] text-center text-slate-400">
                          No matching complaints found on desk.
                        </td>
                      </tr>
                    ) : (
                      filteredComplaints.map((c, idx) => (
                        <tr
                          key={c.id || c.complaint_number}
                          className={`h-[56px] transition-colors ${
                            idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'
                          } hover:bg-slate-100/60`}
                        >
                          <td className="py-2 px-4 font-mono font-bold text-blue-600">
                            <span
                              onClick={() => navigate(`/officer/complaint/${c.id}`)}
                              className="hover:underline cursor-pointer"
                            >
                              #{c.complaint_number}
                            </span>
                          </td>
                          <td className="py-2 px-4">
                            <p className="font-bold text-slate-900 truncate max-w-xs">{c.title}</p>
                            <span className="text-[10px] text-slate-400 block">{c.location || 'Central Sector'}</span>
                          </td>
                          <td className="py-2 px-4">
                            <Badge variant={c.priority}>{c.priority}</Badge>
                          </td>
                          <td className="py-2 px-4">
                            <Badge variant={c.status}>{c.status}</Badge>
                          </td>
                          <td className="py-2 px-4 text-right">
                            <Button
                              variant="primary"
                              size="sm"
                              onClick={() => navigate(`/officer/complaint/${c.id}`)}
                              className="text-xs font-bold h-8 px-3"
                            >
                              Inspect
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
              <span>Showing {filteredComplaints.length} active items on desk</span>
              <Link to="/officer/complaints" className="font-bold text-blue-600 hover:underline flex items-center gap-1">
                View Complete Desk <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          {/* Priority Distribution Breakdown Card */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900">
              Priority Distribution & SLA Thresholds
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-rose-600 block">Critical Priority</span>
                <p className="text-xl font-extrabold text-rose-900">2 Tickets</p>
                <span className="text-[10px] text-rose-700 font-medium block">SLA Target: 24 Hours</span>
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-amber-600 block">High Priority</span>
                <p className="text-xl font-extrabold text-amber-900">5 Tickets</p>
                <span className="text-[10px] text-amber-700 font-medium block">SLA Target: 48 Hours</span>
              </div>

              <div className="p-3 bg-sky-50 rounded-xl border border-sky-100 space-y-1">
                <span className="text-[10px] uppercase font-bold text-sky-600 block">Medium Priority</span>
                <p className="text-xl font-extrabold text-sky-900">8 Tickets</p>
                <span className="text-[10px] text-sky-700 font-medium block">SLA Target: 72 Hours</span>
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-1">
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Low Priority</span>
                <p className="text-xl font-extrabold text-slate-900">3 Tickets</p>
                <span className="text-[10px] text-slate-500 font-medium block">SLA Target: 120 Hours</span>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column (1/3 Width): Schedule Card (Max 420px) & Timeline Card (Max 360px) */}
        <div className="space-y-6">

          {/* Today's Schedule Card (Max Height 420px) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 max-h-[420px] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" /> Today's Schedule
              </h3>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-blue-50 text-blue-600 border border-blue-100">
                4 Tasks
              </span>
            </div>

            <div className="space-y-2.5 text-xs">
              {todaySchedule.map((sch, i) => (
                <div key={i} className="p-3 bg-slate-50 rounded-xl border border-slate-200/80 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-blue-600 text-[11px]">{sch.time}</span>
                    <Badge variant={sch.status === 'Completed' ? 'resolved' : sch.status === 'In Progress' ? 'inprogress' : 'low'}>
                      {sch.status}
                    </Badge>
                  </div>
                  <p className="font-bold text-slate-900 leading-snug">{sch.task}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Officer Activity Timeline (Max Height 360px) */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm space-y-3 max-h-[360px] overflow-y-auto">
            <h3 className="font-extrabold text-xs uppercase tracking-wider text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-2.5">
              <Activity className="w-4 h-4 text-amber-500" /> Officer Activity Log
            </h3>

            <div className="relative border-l-2 border-slate-200 ml-3 space-y-3.5 text-xs pt-1">
              {timeline.map((act) => (
                <div key={act.id} className="relative pl-4 space-y-0.5">
                  <div className="absolute -left-[6px] top-1 w-2.5 h-2.5 rounded-full bg-blue-600 ring-4 ring-white" />
                  <p className="font-bold text-slate-900">
                    #{act.complaint_number} updated to <span className="text-blue-600">{act.status_to}</span>
                  </p>
                  <p className="text-slate-500 text-[11px] leading-tight">{act.comment}</p>
                  <span className="text-[10px] text-slate-400 block pt-0.5 font-medium">
                    {new Date(act.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default OfficerDashboard;
