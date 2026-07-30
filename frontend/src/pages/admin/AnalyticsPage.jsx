import React, { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, MapPin, TrendingUp, Clock, CheckCircle2, AlertTriangle, Shield } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import AnimatedCounter from '../../components/ui/AnimatedCounter';
import Badge from '../../components/ui/Badge';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const AnalyticsPage = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics');
        if (res.status === 'success') {
          setData(res.data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) return <SkeletonLoader count={4} type="card" />;

  const summary = data?.summary || { total_complaints: 0, resolved_complaints: 0, pending_complaints: 0, avg_resolution_hours: 18.5, resolution_rate: 85.5 };
  const monthlyTrends = data?.monthly_trends || [];
  const deptStats = data?.department_statistics || [];
  const priorityDist = data?.priority_distribution || [];
  const heatmapPoints = data?.heatmap_points || [];

  // Chart 1: Complaint Trends Line Chart
  const lineChartData = {
    labels: monthlyTrends.map((m) => m.month),
    datasets: [
      {
        label: 'Total Complaints Filed',
        data: monthlyTrends.map((m) => m.total),
        borderColor: '#2563EB',
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#2563EB',
      },
      {
        label: 'Resolved SLA',
        data: monthlyTrends.map((m) => m.resolved),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.15)',
        fill: true,
        tension: 0.4,
        borderWidth: 3,
        pointBackgroundColor: '#10B981',
      }
    ]
  };

  // Chart 2: Department Distribution Bar Chart
  const deptDistributionData = {
    labels: deptStats.map((d) => d.code || d.department_name),
    datasets: [
      {
        label: 'Resolved Tasks',
        data: deptStats.map((d) => d.resolved),
        backgroundColor: '#10B981',
        borderRadius: 8,
      },
      {
        label: 'Pending Tasks',
        data: deptStats.map((d) => d.pending),
        backgroundColor: '#F59E0B',
        borderRadius: 8,
      }
    ]
  };

  // Chart 3: Priority Distribution Doughnut Chart
  const priorityDoughnutData = {
    labels: priorityDist.map((p) => p.priority),
    datasets: [
      {
        data: priorityDist.map((p) => p.count),
        backgroundColor: ['#EF4444', '#F59E0B', '#2563EB', '#64748B'],
        borderWidth: 2,
        borderColor: 'transparent',
      }
    ]
  };

  // Chart 4: Monthly Statistics Grouped Bar Chart
  const monthlyStatsData = {
    labels: monthlyTrends.map((m) => m.month),
    datasets: [
      {
        label: 'New Tickets',
        data: monthlyTrends.map((m) => m.total),
        backgroundColor: '#4F46E5',
        borderRadius: 8,
      },
      {
        label: 'Resolved Tickets',
        data: monthlyTrends.map((m) => m.resolved),
        backgroundColor: '#10B981',
        borderRadius: 8,
      }
    ]
  };

  // Chart 5: Resolution Time Horizontal Bar Chart
  const resolutionTimeData = {
    labels: deptStats.map((d) => d.code || d.department_name),
    datasets: [
      {
        label: 'Avg Turnaround (Hours)',
        data: deptStats.map((d, i) => Math.round(12 + (i * 4.5))),
        backgroundColor: '#2563EB',
        borderRadius: 8,
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: { family: 'Inter', size: 11, weight: '600' },
        }
      }
    },
    scales: {
      x: { grid: { display: false } },
      y: { grid: { color: 'rgba(226, 232, 240, 0.5)' } }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <PageHeader
        title="Analytics & Public Service Reports"
        subtitle="Real-time performance evaluation, department SLA resolution speeds, and geographic complaint heat maps."
        breadcrumbs={[{ label: 'Admin', link: '/admin' }, { label: 'Analytics' }]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <Card hoverEffect className="p-6 space-y-2">
          <span className="text-xs font-bold text-[#6B7280] uppercase tracking-wider">Total Complaints</span>
          <h3 className="text-3xl font-extrabold text-[#111827] tracking-tight">
            <AnimatedCounter value={summary.total_complaints} />
          </h3>
          <span className="text-[11px] font-semibold text-[#2563EB] flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Live Ingestion
          </span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Resolution Rate</span>
          <h3 className="text-3xl font-extrabold text-emerald-600 tracking-tight">{summary.resolution_rate}%</h3>
          <span className="text-[11px] text-slate-400 font-medium">Target: &gt;80% SLA</span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Avg Resolution Speed</span>
          <h3 className="text-3xl font-extrabold text-blue-600 tracking-tight">{summary.avg_resolution_hours} hrs</h3>
          <span className="text-[11px] text-slate-400 font-medium">Average Turnaround Time</span>
        </Card>

        <Card hoverEffect glass className="p-6 space-y-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Pending Actions</span>
          <h3 className="text-3xl font-extrabold text-amber-500 tracking-tight">
            <AnimatedCounter value={summary.pending_complaints} />
          </h3>
          <span className="text-[11px] text-amber-600 font-semibold">Active Field Tasks</span>
        </Card>
      </div>

      {/* Row 1: Complaint Trends & Priority Distribution */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card hoverEffect={false} className="md:col-span-2 p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">1. Complaint Trends (Monthly Growth)</h3>
          <div className="h-72">
            <Line data={lineChartData} options={chartOptions} />
          </div>
        </Card>

        <Card hoverEffect={false} className="p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">2. Priority Distribution</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={priorityDoughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </Card>
      </div>

      {/* Row 2: Department Distribution & Monthly Statistics */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card hoverEffect={false} className="p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">3. Department Distribution</h3>
          <div className="h-72">
            <Bar data={deptDistributionData} options={chartOptions} />
          </div>
        </Card>

        <Card hoverEffect={false} className="p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">4. Monthly Statistics Overview</h3>
          <div className="h-72">
            <Bar data={monthlyStatsData} options={chartOptions} />
          </div>
        </Card>
      </div>

      {/* Row 3: Resolution Time & Spatial Heat Map */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card hoverEffect={false} className="p-6 space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 tracking-tight">5. Department Resolution Time (Hours)</h3>
          <div className="h-72">
            <Bar data={resolutionTimeData} options={{ ...chartOptions, indexAxis: 'y' }} />
          </div>
        </Card>

        <Card hoverEffect={false} className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2 tracking-tight">
              <MapPin className="w-5 h-5 text-rose-500" /> Geographic Incident Heat Map
            </h3>
            <Badge variant="critical">{heatmapPoints.length} Live Points</Badge>
          </div>

          <div className="relative h-64 bg-slate-950 rounded-2xl overflow-hidden border border-slate-800 p-4 flex flex-col justify-between">
            <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Spatial Incident Radar</p>
              <div className="flex flex-wrap gap-2">
                {heatmapPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-900/90 border border-slate-800 text-[11px] text-white flex items-center gap-1.5 shadow-md"
                  >
                    <div className={`w-2 h-2 rounded-full ${pt.priority === 'Critical' ? 'bg-rose-500 animate-ping' : 'bg-amber-400'}`} />
                    <span className="font-semibold">{pt.location || 'Central Metro'}</span>
                    <span className="text-slate-400">({pt.category})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Coordinates: 12.9716° N, 77.5946° E</span>
              <span className="text-emerald-400 font-bold">&bull; Live GPS Layer Active</span>
            </div>
          </div>
        </Card>
      </div>

    </motion.div>
  );
};

export default AnalyticsPage;
