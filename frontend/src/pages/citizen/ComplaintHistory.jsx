import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, PlusCircle, MapPin, ArrowRight, Shield } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (category) params.append('category', category);
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
  }, [category, status, priority]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchComplaints();
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Complaint History
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and monitor all your filed municipal service requests
          </p>
        </div>

        <Link
          to="/submit-complaint"
          className="px-4 py-2.5 bg-brand-600 hover:bg-brand-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New Complaint</span>
        </Link>
      </div>

      {/* Filters Bar */}
      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Complaint #, Title, Location..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-2 focus:ring-brand-500 text-slate-900 dark:text-slate-100"
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-sm"
          >
            Search
          </button>
        </form>

        <div className="flex flex-wrap gap-3 pt-2 border-t border-slate-100 dark:border-slate-700">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-700 dark:text-slate-200 font-medium"
          >
            <option value="">All Categories</option>
            <option value="Road">Road</option>
            <option value="Water">Water</option>
            <option value="Electricity">Electricity</option>
            <option value="Garbage">Garbage</option>
            <option value="Drainage">Drainage</option>
            <option value="Health">Health</option>
            <option value="Education">Education</option>
            <option value="Transport">Transport</option>
            <option value="Government Office">Government Office</option>
            <option value="Others">Others</option>
          </select>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-700 dark:text-slate-200 font-medium"
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
            className="px-3 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-xs outline-none text-slate-700 dark:text-slate-200 font-medium"
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
          <p className="text-slate-500 font-medium">No complaints matching filter criteria found.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {complaints.map((cmp) => (
            <div
              key={cmp.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs hover:border-brand-300 dark:hover:border-slate-600 transition-all space-y-3"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-extrabold text-brand-600 dark:text-brand-400 bg-brand-50 dark:bg-brand-950/60 px-2.5 py-1 rounded-lg border border-brand-200 dark:border-brand-800">
                    #{cmp.complaint_number}
                  </span>
                  <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{cmp.category}</span>
                  <span className="text-xs text-slate-400">&bull;</span>
                  <span className="text-xs text-slate-500 dark:text-slate-400">{cmp.department_name || 'Unassigned Dept'}</span>
                </div>

                <span className={`text-xs font-bold px-3 py-1 rounded-xl border ${getStatusBadge(cmp.status)}`}>
                  {cmp.status}
                </span>
              </div>

              <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{cmp.title}</h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-2">{cmp.description}</p>

              <div className="flex flex-wrap items-center justify-between text-xs text-slate-500 dark:text-slate-400 pt-3 border-t border-slate-100 dark:border-slate-700 gap-2">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>{cmp.location || 'Location Not Specified'}</span>
                </div>

                <Link
                  to={`/complaints/${cmp.id}`}
                  className="font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
                >
                  View Details & Audit Logs <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ComplaintHistory;
