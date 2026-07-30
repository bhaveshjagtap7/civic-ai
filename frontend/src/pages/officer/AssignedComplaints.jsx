import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, ArrowRight, Building2, MapPin } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const AssignedComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (status) params.append('status', status);
      if (priority) params.append('priority', priority);

      const res = await api.get(`/complaints?${params.toString()}`);
      if (res.status === 'success') {
        setComplaints(res.data.complaints);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [status, priority]);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchComplaints();
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

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Assigned Department Desk
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage, inspect, and update field resolution status for assigned civic tickets
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-3">
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket #, description, citizen name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-sm">
            Search
          </button>
        </form>

        <div className="flex gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">All Statuses</option>
            <option value="Submitted">Submitted</option>
            <option value="Assigned">Assigned</option>
            <option value="In Progress">In Progress</option>
            <option value="Resolved">Resolved</option>
            <option value="Rejected">Rejected</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs font-medium text-slate-700 dark:text-slate-300 outline-none"
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>

      {/* Complaints List */}
      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : complaints.length === 0 ? (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/60">
          <p className="text-slate-500 font-medium">No assigned complaints matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:border-amber-300 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2.5 py-1 rounded-lg border border-amber-200 dark:border-amber-800">
                    #{cmp.complaint_number}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${getPriorityBadge(cmp.priority)}`}>
                    {cmp.priority}
                  </span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs font-medium text-slate-500">{cmp.category}</span>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusBadge(cmp.status)}`}>
                  {cmp.status}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{cmp.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{cmp.description}</p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700 gap-2">
                <div className="flex items-center gap-4">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">Citizen: {cmp.citizen_name} ({cmp.citizen_phone || 'No phone'})</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate max-w-xs">{cmp.location}</span>
                  </div>
                </div>

                <Link
                  to={`/officer/complaint/${cmp.id}`}
                  className="font-bold text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1"
                >
                  Manage & Update Status <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssignedComplaints;
