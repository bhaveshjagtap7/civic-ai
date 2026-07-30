import React, { useState, useEffect } from 'react';
import { useToast } from '../../components/common/Toast';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { UserPlus, Trash2, Edit3, X } from 'lucide-react';
import api from '../../services/api';
import PageHeader from '../../components/layout/PageHeader';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import FormInput from '../../components/ui/FormInput';
import DataTable from '../../components/ui/DataTable';
import { motion } from 'framer-motion';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'Officer',
    department_id: '',
    phone: ''
  });

  const { showSuccess, showError } = useToast();

  const fetchUsers = async () => {
    try {
      const res = await api.get('/admin/users');
      if (res.status === 'success') {
        setUsers(res.data || []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchDepartments = async () => {
    try {
      const res = await api.get('/admin/departments');
      if (res.status === 'success') {
        setDepartments(res.data || []);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
    fetchDepartments();
  }, []);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const res = await api.post('/admin/users', formData);
      if (res.status === 'success') {
        showSuccess("User created successfully!");
        setIsCreateOpen(false);
        setFormData({ name: '', email: '', password: '', role: 'Officer', department_id: '', phone: '' });
        fetchUsers();
      }
    } catch (err) {
      showError(err.message || "Failed to create user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setActionLoading(true);
    try {
      const res = await api.delete(`/admin/users/${deleteId}`);
      if (res.status === 'success') {
        showSuccess("User deleted.");
        setDeleteId(null);
        fetchUsers();
      }
    } catch (err) {
      showError(err.message || "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      header: 'User Details',
      key: 'name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-bold text-[#111827] text-xs">{val}</p>
          <p className="text-[11px] text-[#6B7280]">{row.email}</p>
        </div>
      ),
    },
    {
      header: 'Role',
      key: 'role',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Assigned Department',
      key: 'department_name',
      sortable: true,
      render: (val) => <span className="font-medium text-slate-700 dark:text-slate-300">{val || 'General Citizen'}</span>,
    },
    {
      header: 'Phone',
      key: 'phone',
      render: (val) => <span className="text-slate-500">{val || 'Not specified'}</span>,
    },
    {
      header: 'Actions',
      key: 'id',
      align: 'right',
      render: (val, row) => (
        <div className="flex items-center justify-end gap-1">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(val);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete User"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'role',
      label: 'Role',
      options: [
        { value: 'Citizen', label: 'Citizen' },
        { value: 'Officer', label: 'Officer' },
        { value: 'Admin', label: 'Admin' },
      ],
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
        title="User & Officer Management"
        subtitle="Provision department officers, assign municipal sectors, and manage system accounts."
        breadcrumbs={[{ label: 'Admin', link: '/admin' }, { label: 'Users & Officers' }]}
        action={
          <Button variant="primary" icon={UserPlus} onClick={() => setIsCreateOpen(true)}>
            Provision New Officer
          </Button>
        }
      />

      {loading ? (
        <SkeletonLoader count={4} type="table" />
      ) : (
        <DataTable
          columns={columns}
          data={users}
          filterOptions={filterOptions}
          searchPlaceholder="Search by user name, email, phone..."
        />
      )}

      {/* Create Modal */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <Card hoverEffect={false} className="w-full max-w-md p-6 space-y-4 glass-card">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">Provision Account</h3>
              <button onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-3">
              <FormInput
                label="Full Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Er. Suresh Kumar"
                required
              />

              <FormInput
                label="Email Address"
                type="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="officer@civicai.gov"
                required
              />

              <FormInput
                label="Password"
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                required
              />

              <div className="grid grid-cols-2 gap-3">
                <FormInput
                  label="Account Role"
                  type="select"
                  name="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  options={[
                    { value: 'Officer', label: 'Officer' },
                    { value: 'Citizen', label: 'Citizen' },
                    { value: 'Admin', label: 'Admin' },
                  ]}
                />

                <FormInput
                  label="Department"
                  type="select"
                  name="department_id"
                  value={formData.department_id}
                  onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                  options={[
                    { value: '', label: 'None (Citizen)' },
                    ...departments.map((d) => ({ value: d.id, label: d.name })),
                  ]}
                />
              </div>

              <Button
                type="submit"
                variant="primary"
                loading={actionLoading}
                className="w-full py-3 mt-2"
              >
                Create Account
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmationModal
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete User Account"
        message="Are you sure you want to permanently delete this user account from the system?"
        isDanger={true}
        loading={actionLoading}
      />
    </motion.div>
  );
};

export default ManageUsers;
