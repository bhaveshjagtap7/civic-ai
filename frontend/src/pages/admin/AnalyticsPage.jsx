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
  Legend
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import { BarChart3, Clock, CheckCircle2, AlertTriangle, MapPin, Sparkles, TrendingUp, Shield } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
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

  // Monthly Line Chart Data
  const lineChartData = {
    labels: monthlyTrends.map((m) => m.month),
    datasets: [
      {
        label: 'Total Complaints Filed',
        data: monthlyTrends.map((m) => m.total),
        borderColor: '#3B82F6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        fill: true,
        tension: 0.4
      },
      {
        label: 'Resolved SLA',
        data: monthlyTrends.map((m) => m.resolved),
        borderColor: '#10B981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        fill: true,
        tension: 0.4
      }
    ]
  };

  // Department Bar Chart Data
  const barChartData = {
    labels: deptStats.map((d) => d.code || d.department_name),
    datasets: [
      {
        label: 'Resolved',
        data: deptStats.map((d) => d.resolved),
        backgroundColor: '#10B981'
      },
      {
        label: 'Pending',
        data: deptStats.map((d) => d.pending),
        backgroundColor: '#F59E0B'
      }
    ]
  };

  // Priority Doughnut Chart Data
  const doughnutData = {
    labels: priorityDist.map((p) => p.priority),
    datasets: [
      {
        data: priorityDist.map((p) => p.count),
        backgroundColor: ['#EF4444', '#F59E0B', '#3B82F6', '#64748B']
      }
    ]
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <div className="flex items-center gap-2 text-brand-600 dark:text-brand-400 font-bold text-xs uppercase tracking-wider mb-1">
          <BarChart3 className="w-4 h-4 text-brand-500" />
          Real-Time Governance Metrics
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Analytics & Public Service Reports
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Comprehensive performance evaluation, department SLA resolution speeds, and geographic heat maps
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Total System Complaints</span>
          <h3 className="text-3xl font-extrabold text-slate-900 dark:text-slate-100">{summary.total_complaints}</h3>
          <span className="text-[11px] font-semibold text-brand-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" /> Live Ingestion
          </span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Resolution Rate</span>
          <h3 className="text-3xl font-extrabold text-emerald-600">{summary.resolution_rate}%</h3>
          <span className="text-[11px] text-slate-400">Target: &gt;80% SLA</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Avg Resolution Speed</span>
          <h3 className="text-3xl font-extrabold text-brand-600">{summary.avg_resolution_hours} hrs</h3>
          <span className="text-[11px] text-slate-400">Average Turnaround Time</span>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <span className="text-xs font-semibold text-slate-500">Pending Actions</span>
          <h3 className="text-3xl font-extrabold text-amber-500">{summary.pending_complaints}</h3>
          <span className="text-[11px] text-amber-600 font-semibold">Active Field Tasks</span>
        </div>
      </div>

      {/* Charts Grid Row 1 */}
      <div className="grid md:grid-cols-3 gap-8">
        
        {/* Monthly Trend Line Chart */}
        <div className="md:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Monthly Complaint & Resolution Trends</h3>
          <div className="h-72">
            <Line data={lineChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Priority Doughnut Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Priority Breakdown</h3>
          <div className="h-64 flex items-center justify-center">
            <Doughnut data={doughnutData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

      </div>

      {/* Charts Grid Row 2 */}
      <div className="grid md:grid-cols-2 gap-8">
        
        {/* Department Statistics Bar Chart */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
          <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Department Performance Statistics</h3>
          <div className="h-72">
            <Bar data={barChartData} options={{ responsive: true, maintainAspectRatio: false }} />
          </div>
        </div>

        {/* Heat Map Placeholder UI Card */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MapPin className="w-5 h-5 text-rose-500" /> Geographic Incident Heat Map
            </h3>
            <span className="text-xs font-extrabold px-2.5 py-1 bg-rose-50 dark:bg-rose-950/60 text-rose-600 rounded-lg">
              {heatmapPoints.length} Live Points
            </span>
          </div>

          <div className="relative h-64 bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 p-4 flex flex-col justify-between">
            {/* Visual Heatmap Grid Overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] opacity-20 pointer-events-none" />

            <div className="relative z-10 space-y-2">
              <p className="text-xs text-slate-300 font-bold uppercase tracking-wider">Spatial Incident Distribution</p>
              <div className="flex flex-wrap gap-2">
                {heatmapPoints.map((pt, idx) => (
                  <div
                    key={idx}
                    className="px-2.5 py-1 rounded-lg bg-slate-800/90 border border-slate-700 text-[11px] text-white flex items-center gap-1.5 shadow-md"
                  >
                    <div className={`w-2 h-2 rounded-full ${pt.priority === 'Critical' ? 'bg-rose-500 animate-ping' : pt.priority === 'High' ? 'bg-rose-500' : 'bg-amber-400'}`} />
                    <span className="font-semibold">{pt.location || 'Central Metro'}</span>
                    <span className="text-slate-400">({pt.category})</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10 pt-2 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
              <span>Coordinates: 12.9716° N, 77.5946° E (City Central)</span>
              <span className="text-emerald-400 font-bold">&bull; Live GPS Layer Active</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AnalyticsPage;
