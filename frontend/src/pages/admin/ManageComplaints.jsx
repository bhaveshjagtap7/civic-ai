import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ArrowRight, Building2, MapPin, Trash2, Edit3 } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useToast } from '../../components/common/Toast';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);

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
  }, []);

  const handleDelete = async () => {
    if (!deleteId) return;
    setDeleting(true);
    try {
      const res = await api.delete(`/complaints/${deleteId}`);
      if (res.status === 'success') {
        showSuccess("Complaint record deleted.");
        setDeleteId(null);
        fetchComplaints();
      }
    } catch (err) {
      showError(err.message || "Failed to delete complaint.");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
          Global Complaint Monitoring
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          System-wide oversight across all citizen service requests, departments, and field updates
        </p>
      </div>

      <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs">
        <form onSubmit={(e) => { e.preventDefault(); fetchComplaints(); }} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by ticket #, department, category, citizen name..."
              className="w-full pl-9 pr-4 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl text-sm outline-none text-slate-900 dark:text-slate-100"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl text-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-700 text-slate-400 uppercase font-bold text-[10px] bg-slate-50/50 dark:bg-slate-900/50">
                  <th className="py-3.5 px-4">Ticket #</th>
                  <th className="py-3.5 px-4">Title & Citizen</th>
                  <th className="py-3.5 px-4">Dept & Category</th>
                  <th className="py-3.5 px-4">Priority</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
                {complaints.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="py-3.5 px-4 font-bold text-brand-600 dark:text-brand-400">
                      #{c.complaint_number}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-900 dark:text-slate-100">{c.title}</p>
                      <p className="text-slate-400 text-[11px]">{c.citizen_name}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="font-bold text-slate-800 dark:text-slate-200">{c.department_name}</p>
                      <p className="text-slate-400 text-[11px]">{c.category}</p>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className={`px-2 py-0.5 rounded text-[10px] ${
                        c.priority === 'Critical' ? 'bg-rose-500 text-white font-bold' :
                        c.priority === 'High' ? 'bg-rose-100 text-rose-700' : 'bg-amber-100 text-amber-700'
                      }`}>
                        {c.priority}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold">
                      <span className="px-2.5 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-lg">
                        {c.status}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right space-x-2">
                      <Link
                        to={`/complaints/${c.id}`}
                        className="font-bold text-brand-600 hover:underline inline-flex items-center gap-1"
                      >
                        Inspect <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="text-rose-600 hover:text-rose-800 p-1"
                        title="Delete Record"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Complaint Ticket"
        message="Are you sure you want to permanently delete this complaint ticket and its audit logs?"
        isDanger={true}
        loading={deleting}
      />
    </div>
  );
};

export default ManageComplaints;
