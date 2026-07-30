import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Building2, FileText, CheckCircle2, Clock, BarChart3, Settings, Shield } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminDashboard = async () => {
      try {
        const res = await api.get('/admin/dashboard');
        if (res.status === 'success') {
          setData(res.data);
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

  const counts = data?.counts || { citizens: 0, officers: 0, departments: 0, total_complaints: 0, resolved_complaints: 0, pending_complaints: 0 };
  const workload = data?.department_workload || [];
  const recentUsers = data?.recent_users || [];

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      
      {/* Admin Hero Header */}
      <div className="bg-gradient-to-r from-purple-700 via-indigo-800 to-brand-800 p-6 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2 text-purple-200 text-xs font-semibold uppercase tracking-wider mb-2">
            <Shield className="w-4 h-4 text-amber-300" />
            Central Municipal Governance
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Admin System Overview
          </h1>
          <p className="mt-2 text-purple-100 text-sm max-w-xl leading-relaxed">
            Monitor platform health, citizen complaint volume, department SLA efficiency, and AI routing performance across all municipal sectors.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <Link
            to="/admin/analytics"
            className="px-5 py-3 bg-white text-purple-900 font-bold rounded-2xl shadow-lg hover:bg-purple-50 transition-all flex items-center gap-2 text-xs"
          >
            <BarChart3 className="w-4 h-4 text-purple-600" />
            <span>Full Analytics & SLA</span>
          </Link>
        </div>
      </div>

      {/* Metric Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Complaints</span>
            <div className="p-2 rounded-xl bg-brand-50 text-brand-600 dark:bg-brand-950/60">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{counts.total_complaints}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Resolved SLA</span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{counts.resolved_complaints}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Citizens</span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 dark:bg-purple-950/60">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{counts.citizens}</h3>
        </div>

        <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Active Departments</span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 dark:bg-amber-950/60">
              <Building2 className="w-4 h-4" />
            </div>
          </div>
          <h3 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100">{counts.departments}</h3>
        </div>
      </div>

      {/* Department Workload Breakdown */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Municipal Department Workload</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total assigned complaints vs resolution percentage</p>
          </div>
          <Link to="/admin/departments" className="text-xs font-bold text-purple-600 dark:text-purple-400 hover:underline">
            Manage Departments &rarr;
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold text-[10px]">
                <th className="py-3 px-4">Department Name</th>
                <th className="py-3 px-4 text-center">Total Assigned</th>
                <th className="py-3 px-4 text-center">Resolved</th>
                <th className="py-3 px-4 text-right">Completion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
              {workload.map((dept, idx) => {
                const total = parseInt(dept.total_complaints) || 0;
                const resolved = parseInt(dept.resolved_count) || 0;
                const pct = total > 0 ? Math.round((resolved / total) * 100) : 100;
                return (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-slate-100">{dept.name}</td>
                    <td className="py-3 px-4 text-center font-semibold text-slate-700 dark:text-slate-300">{total}</td>
                    <td className="py-3 px-4 text-center font-semibold text-emerald-600">{resolved}</td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <div className="w-24 bg-slate-100 dark:bg-slate-700 rounded-full h-2 overflow-hidden">
                          <div className="bg-purple-600 h-full rounded-full" style={{ width: `${pct}%` }} />
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
      </div>

    </div>
  );
};

export default AdminDashboard;
