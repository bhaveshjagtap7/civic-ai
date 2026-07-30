import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { Building2, Plus, Users, FileText, Mail, Shield, X } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';

const ManageDepartments = () => {
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    description: '',
    head_name: '',
    contact_email: '',
    icon: 'Building2'
  });
  const [submitting, setSubmitting] = useState(false);

  const { showSuccess, showError } = useToast();

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/departments');
      if (res.status === 'success') {
        setDepartments(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/admin/departments', formData);
      if (res.status === 'success') {
        showSuccess("New department registered!");
        setIsModalOpen(false);
        setFormData({ name: '', code: '', description: '', head_name: '', contact_email: '', icon: 'Building2' });
        fetchDepartments();
      }
    } catch (err) {
      showError(err.message || "Failed to create department.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100">
            Municipal Departments
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure sector routing codes, department heads, and contact dispatching
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200/80 dark:border-slate-700/60 shadow-xs space-y-4 hover:border-purple-300 transition-all"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300 rounded-lg border border-purple-200">
                  CODE: {dept.code}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{dept.name}</h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">{dept.description || 'Municipal civic sector'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-700 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Department Head:</span>
                  <span className="font-bold">{dept.head_name || 'Unspecified'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Contact Dispatch:</span>
                  <span className="font-semibold text-brand-600">{dept.contact_email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1">
                  <span className="text-slate-400 font-medium">Assigned Officers:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{dept.officer_count || 0} Officers</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 w-full max-w-md shadow-2xl space-y-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-3">
              <h3 className="font-bold text-base text-slate-900 dark:text-slate-100">Add Municipal Department</h3>
              <button onClick={() => setIsModalOpen(false)}><X className="w-5 h-5 text-slate-400" /></button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Department Name</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  placeholder="e.g. Public Works & Roads"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Sector Code</label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  required
                  placeholder="PWR"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none font-bold uppercase"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Head Official Name</label>
                <input
                  type="text"
                  value={formData.head_name}
                  onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                  placeholder="Er. Rajesh Sharma"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Contact Email</label>
                <input
                  type="email"
                  value={formData.contact_email}
                  onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                  placeholder="roads@civicai.gov"
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Sector responsibilities..."
                  className="w-full p-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-md transition-colors mt-2"
              >
                Save Department
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageDepartments;
