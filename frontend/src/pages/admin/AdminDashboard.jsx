import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Users,
  Building2,
  FileText,
  CheckCircle2,
  BarChart3,
  Shield,
  Activity,
  Star,
  Clock,
  Sparkles,
  UserCheck,
  MapPin,
  TrendingUp,
  Award,
} from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import PageHeader from '../../components/layout/PageHeader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import StatCard from '../../components/ui/StatCard';
import DataTable from '../../components/ui/DataTable';
import { MonthlyTrendChartCard } from '../../components/ui/ChartCard';
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
          api.get('/analytics'),
        ]);
        if (dashRes.status === 'success') {
          setData(dashRes.data);
        }
        if (analyticsRes.status === 'success') {
          setAnalyticsData(analyticsRes.data);
        }
      } catch (err) {
        console.error("Admin dashboard fetch error", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminDashboard();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const counts = data?.counts || {
    citizens: 1240,
    officers: 48,
    departments: 8,
    total_complaints: 450,
    resolved_complaints: 395,
    pending_complaints: 42,
    rejected_complaints: 13,
    resolution_rate: 92,
  };
  const workload = data?.department_workload || [
    { name: 'Municipal Corporation', total_complaints: 140, resolved_count: 130 },
    { name: 'Water Supply', total_complaints: 110, resolved_count: 102 },
    { name: 'Public Works', total_complaints: 95, resolved_count: 85 },
    { name: 'Electricity Board', total_complaints: 65, resolved_count: 60 },
    { name: 'Sanitation Dept', total_complaints: 40, resolved_count: 38 },
  ];
  const recentUsers = data?.recent_users || [
    { id: 1, name: 'Rahul Sharma', email: 'rahul@example.com', role: 'Citizen', created_at: '2026-07-30' },
    { id: 2, name: 'Officer Rajesh Kumar', email: 'rajesh@mc.gov.in', role: 'Officer', created_at: '2026-07-29' },
    { id: 3, name: 'Priya Verma', email: 'priya@example.com', role: 'Citizen', created_at: '2026-07-28' },
  ];
  const liveActivity = data?.live_activity_feed || [
    { id: 1, complaint_number: 'CIV-2026-1024', status_to: 'In Progress', comment: 'Assigned to Municipal Roads Division via AI', user_name: 'Gemini AI', created_at: new Date().toISOString() },
    { id: 2, complaint_number: 'CIV-2026-1018', status_to: 'Resolved', comment: 'Field proof verified by Ward Inspector', user_name: 'Officer Rajesh', created_at: new Date(Date.now() - 1800000).toISOString() },
  ];
  const feedbackSummary = data?.feedback_summary || {
    avg_rating: 4.8,
    total_reviews: 184,
    recent_reviews: [
      { id: 1, complaint_number: 'CIV-2026-1018', citizen_name: 'Rahul Sharma', rating: 5, feedback_notes: 'Pothole fixed within 24 hours! Outstanding service.' },
      { id: 2, complaint_number: 'CIV-2026-1009', citizen_name: 'Amit Patel', rating: 4, feedback_notes: 'Water supply issue resolved cleanly.' },
    ],
  };
  const systemHealth = data?.system_health || {
    ai_auto_routing: 'Operational (Gemini 1.5 Flash)',
    sla_critical_hours: 24,
    sla_high_hours: 48,
    sla_medium_hours: 72,
    sla_low_hours: 120,
  };

  // Latest Complaints Mock Table Data
  const latestComplaints = [
    { id: 1, complaint_number: 'CIV-2026-1024', title: 'Road Maintenance Issues', department: 'Municipal Corporation', status: 'In Progress', priority: 'Medium', date: '2026-07-30' },
    { id: 2, complaint_number: 'CIV-2026-1018', title: 'Garbage Collection Blockage', department: 'Municipal Corporation', status: 'Resolved', priority: 'Low', date: '2026-07-28' },
    { id: 3, complaint_number: 'CIV-2026-1015', title: 'Street Light Fault', department: 'Electricity Board', status: 'Submitted', priority: 'High', date: '2026-07-25' },
    { id: 4, complaint_number: 'CIV-2026-1009', title: 'Main Water Pipe Leakage', department: 'Water Supply', status: 'Resolved', priority: 'Critical', date: '2026-07-20' },
  ];

  const columns = [
    {
      header: 'Complaint ID',
      key: 'complaint_number',
      render: (val) => <span className="font-bold text-blue-600 dark:text-blue-400">#{val}</span>,
    },
    {
      header: 'Complaint Title',
      key: 'title',
      render: (val) => <span className="font-bold text-slate-900 dark:text-slate-100">{val}</span>,
    },
    {
      header: 'Department',
      key: 'department',
      render: (val) => <span className="text-slate-600 dark:text-slate-300">{val}</span>,
    },
    {
      header: 'Status',
      key: 'status',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Priority',
      key: 'priority',
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Admin Analytics & System Control"
        subtitle="Monitor municipal performance, manage ward officers and departments, and track city-wide resolution SLAs."
        breadcrumbs={[{ label: 'Admin Overview' }]}
        action={
          <Link to="/admin/analytics">
            <Button variant="primary" icon={BarChart3}>
              SLA & Analytics Reports
            </Button>
          </Link>
        }
      />

      {/* 2. Top Statistics Cards (5 Key Metrics) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <StatCard
          title="Total Citizens"
          value={counts.citizens}
          icon={Users}
          trend="+8.5%"
          trendUp={true}
          subtitle="Registered users"
          colorVariant="blue"
        />
        <StatCard
          title="Field Officers"
          value={counts.officers}
          icon={UserCheck}
          trend="Active"
          trendUp={true}
          subtitle="Department staff"
          colorVariant="amber"
        />
        <StatCard
          title="Departments"
          value={counts.departments}
          icon={Building2}
          trend="8 Active"
          trendUp={true}
          subtitle="SLA configured"
          colorVariant="indigo"
        />
        <StatCard
          title="Total Complaints"
          value={counts.total_complaints}
          icon={FileText}
          trend="+14% MoM"
          trendUp={true}
          subtitle={`${counts.pending_complaints} Pending`}
          colorVariant="blue"
        />
        <StatCard
          title="Resolution Rate"
          value={`${counts.resolution_rate}%`}
          icon={CheckCircle2}
          trend="Target > 90%"
          trendUp={true}
          subtitle="Resolved SLA"
          colorVariant="emerald"
        />
      </div>

      {/* 3. System Health & Gemini AI Status Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-slate-100">
                Gemini AI Auto-Routing & System Health
              </h3>
              <p className="text-[11px] text-slate-400">Live operational status and SLA thresholds</p>
            </div>
          </div>

          <Badge variant="resolved">
            All Systems Operational
          </Badge>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-4 text-xs pt-1">
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">AI Routing Engine</span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400 mt-0.5 block">{systemHealth.ai_auto_routing}</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Critical SLA</span>
            <span className="font-bold text-rose-600 dark:text-rose-400 mt-0.5 block">{systemHealth.sla_critical_hours} Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">High Priority SLA</span>
            <span className="font-bold text-amber-600 dark:text-amber-400 mt-0.5 block">{systemHealth.sla_high_hours} Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Medium Priority SLA</span>
            <span className="font-bold text-sky-600 dark:text-sky-400 mt-0.5 block">{systemHealth.sla_medium_hours} Hours</span>
          </div>
          <div>
            <span className="text-slate-400 block text-[10px] uppercase font-semibold">Low Priority SLA</span>
            <span className="font-bold text-slate-600 dark:text-slate-300 mt-0.5 block">{systemHealth.sla_low_hours} Hours</span>
          </div>
        </div>
      </div>

      {/* 4. Main Charts & Analytics Row */}
      <div className="grid md:grid-cols-2 gap-6">
        <MonthlyTrendChartCard />

        {/* Department Performance Bar Breakdown */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <Building2 className="w-4 h-4 text-indigo-600" /> Department Performance
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Completion percentage per department</p>
            </div>
            <Link to="/admin/departments" className="text-xs font-bold text-indigo-600 hover:underline">
              Manage &rarr;
            </Link>
          </div>

          <div className="space-y-3 text-xs">
            {workload.map((dept, idx) => {
              const total = parseInt(dept.total_complaints) || 1;
              const resolved = parseInt(dept.resolved_count) || 0;
              const pct = Math.round((resolved / total) * 100);
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800 dark:text-slate-200">{dept.name}</span>
                    <span className="font-bold text-slate-900 dark:text-slate-100">{resolved}/{total} ({pct}%)</span>
                  </div>
                  <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                    <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 5. Heatmap & Latest Complaints Section */}
      <div className="grid lg:grid-cols-3 gap-6">

        {/* Left Column (2/3 Width): Latest Complaints Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                  Latest Municipal Complaints
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time incoming complaint queue
                </p>
              </div>
              <Link to="/admin/complaints" className="text-xs font-bold text-blue-600 hover:underline">
                View All Complaints &rarr;
              </Link>
            </div>

            <DataTable
              columns={columns}
              data={latestComplaints}
              searchable={true}
              pageSize={5}
            />
          </div>
        </div>

        {/* Right Column (1/3 Width): Top Department, Complaint Heatmap & Feedback */}
        <div className="space-y-6">

          {/* Top Performing Department Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Award className="w-4 h-4 text-amber-500" /> Top Performing Department
              </span>
              <Badge variant="resolved">95% Resolution</Badge>
            </div>
            <h4 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Municipal Water Supply Dept
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Resolved 102 out of 110 complaints with average resolution speed under 18 hours.
            </p>
          </div>

          {/* Complaint Heatmap Placeholder Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-rose-500" /> District Complaint Heatmap
              </h3>
              <span className="text-[10px] text-slate-400 font-semibold">City Map</span>
            </div>

            <div className="w-full h-36 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/80 flex items-center justify-center text-center p-4">
              <div className="space-y-1">
                <MapPin className="w-6 h-6 text-rose-500 mx-auto animate-bounce" />
                <p className="font-bold text-xs text-slate-800 dark:text-slate-200">High Density Sector 4 & Central Ward</p>
                <p className="text-[10px] text-slate-400">Geo-tag analytics mapping active</p>
              </div>
            </div>
          </div>

          {/* Feedback Summary Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-slate-100">
                Citizen Feedback Rating
              </h3>
              <div className="flex items-center gap-1 text-amber-500 font-extrabold text-sm">
                <Star className="w-4 h-4 fill-amber-400" />
                <span>{feedbackSummary.avg_rating} / 5</span>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              {feedbackSummary.recent_reviews.map((fb) => (
                <div key={fb.id} className="p-3 bg-slate-50 dark:bg-slate-800/40 rounded-xl border border-slate-200/60 dark:border-slate-800 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 dark:text-slate-100">#{fb.complaint_number} - {fb.citizen_name}</span>
                    <span className="font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3 h-3 fill-amber-400" /> {fb.rating}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 italic text-[11px]">"{fb.feedback_notes}"</p>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>
    </motion.div>
  );
};

export default AdminDashboard;
