import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Trash2 } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import ConfirmationModal from '../../components/common/ConfirmationModal';
import { useToast } from '../../components/common/Toast';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { motion } from 'framer-motion';

const ManageComplaints = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();

  const { showSuccess, showError } = useToast();

  const fetchComplaints = async () => {
    setLoading(true);
    try {
      const res = await api.get('/complaints');
      if (res.status === 'success') {
        setComplaints(res.data.complaints || []);
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

  const columns = [
    {
      header: 'Ticket #',
      key: 'complaint_number',
      sortable: true,
      render: (val) => (
        <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 text-[11px]">
          #{val}
        </span>
      ),
    },
    {
      header: 'Title & Citizen',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{val}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">By {row.citizen_name || 'Citizen'}</p>
        </div>
      ),
    },
    {
      header: 'Dept & Category',
      key: 'department_name',
      sortable: true,
      render: (val, row) => (
        <div>
          <p className="font-bold text-slate-800 dark:text-slate-200">{val || 'Unassigned'}</p>
          <p className="text-[11px] text-slate-500">{row.category}</p>
        </div>
      ),
    },
    {
      header: 'Priority',
      key: 'priority',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Status',
      key: 'status',
      sortable: true,
      render: (val) => <Badge variant={val}>{val}</Badge>,
    },
    {
      header: 'Actions',
      key: 'id',
      align: 'right',
      render: (val) => (
        <div className="flex items-center justify-end gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/complaints/${val}`);
            }}
            icon={ArrowRight}
          >
            Inspect
          </Button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setDeleteId(val);
            }}
            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      ),
    },
  ];

  const filterOptions = [
    {
      key: 'status',
      label: 'Status',
      options: [
        { value: 'Submitted', label: 'Submitted' },
        { value: 'Assigned', label: 'Assigned' },
        { value: 'In Progress', label: 'In Progress' },
        { value: 'Resolved', label: 'Resolved' },
        { value: 'Rejected', label: 'Rejected' },
      ],
    },
    {
      key: 'priority',
      label: 'Priority',
      options: [
        { value: 'Critical', label: 'Critical' },
        { value: 'High', label: 'High' },
        { value: 'Medium', label: 'Medium' },
        { value: 'Low', label: 'Low' },
      ],
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Global Complaint Monitoring
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          System-wide oversight across all citizen service requests, departments, and field updates
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="table" />
      ) : (
        <DataTable
          columns={columns}
          data={complaints}
          filterOptions={filterOptions}
          searchPlaceholder="Search by ticket #, department, category, citizen name..."
          onRowClick={(row) => navigate(`/complaints/${row.id}`)}
        />
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
    </motion.div>
  );
};

export default ManageComplaints;
