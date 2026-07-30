import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import { Building2, Plus, X } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import { motion } from 'framer-motion';

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
        setDepartments(res.data || []);
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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Municipal Departments
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Configure sector routing codes, department heads, and contact dispatching
          </p>
        </div>

        <Button
          variant="primary"
          icon={Plus}
          onClick={() => setIsModalOpen(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          Add Department
        </Button>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="card" />
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card
              key={dept.id}
              hoverEffect
              className="p-6 space-y-4"
            >
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-extrabold px-2.5 py-1 bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 rounded-lg border border-indigo-200 dark:border-indigo-800">
                  CODE: {dept.code}
                </span>
              </div>

              <div>
                <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">{dept.name}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">{dept.description || 'Municipal civic sector'}</p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Department Head:</span>
                  <span className="font-bold">{dept.head_name || 'Unspecified'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="text-slate-400 font-medium">Contact Dispatch:</span>
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{dept.contact_email || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300 pt-1">
                  <span className="text-slate-400 font-medium">Assigned Officers:</span>
                  <span className="font-bold text-slate-900 dark:text-slate-100">{dept.officer_count || 0} Officers</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card hoverEffect={false} className="w-full max-w-md p-6 space-y-4 glass-card">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Add Municipal Department</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <FormInput
                label="Department Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g. Public Works & Roads"
                required
              />

              <FormInput
                label="Sector Code"
                type="text"
                name="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                placeholder="PWR"
                required
              />

              <FormInput
                label="Head Official Name"
                type="text"
                name="head_name"
                value={formData.head_name}
                onChange={(e) => setFormData({ ...formData, head_name: e.target.value })}
                placeholder="Er. Rajesh Sharma"
              />

              <FormInput
                label="Contact Email"
                type="email"
                name="contact_email"
                value={formData.contact_email}
                onChange={(e) => setFormData({ ...formData, contact_email: e.target.value })}
                placeholder="roads@civicai.gov"
              />

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Sector responsibilities..."
                  className="w-full p-2.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700/80 rounded-xl text-xs outline-none focus:ring-2 focus:ring-blue-500/20"
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={submitting}
                className="w-full py-3 mt-2"
              >
                Save Department
              </Button>
            </form>
          </Card>
        </div>
      )}
    </motion.div>
  );
};

export default ManageDepartments;
