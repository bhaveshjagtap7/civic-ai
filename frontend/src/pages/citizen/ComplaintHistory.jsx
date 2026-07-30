import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { PlusCircle, MapPin, ArrowRight } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { motion } from 'framer-motion';

const ComplaintHistory = () => {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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

  const columns = [
    {
      header: 'Complaint #',
      key: 'complaint_number',
      sortable: true,
      render: (val, row) => (
        <span className="font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded-lg border border-blue-200 dark:border-blue-800 text-[11px]">
          #{val}
        </span>
      ),
    },
    {
      header: 'Subject & Description',
      key: 'title',
      sortable: true,
      render: (val, row) => (
        <div>
          <h4 className="font-bold text-slate-900 dark:text-slate-100 text-xs">{val}</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate max-w-xs">{row.description}</p>
        </div>
      ),
    },
    {
      header: 'Category',
      key: 'category',
      sortable: true,
      render: (val) => <span className="font-semibold text-slate-700 dark:text-slate-300">{val}</span>,
    },
    {
      header: 'Department',
      key: 'department_name',
      sortable: true,
      render: (val) => <span className="text-slate-500 dark:text-slate-400">{val || 'Unassigned'}</span>,
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
      header: 'Action',
      key: 'id',
      align: 'right',
      render: (val) => (
        <Button
          variant="outline"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/complaints/${val}`);
          }}
          icon={ArrowRight}
        >
          View Details
        </Button>
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
            Complaint History
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
            Track and monitor all your filed municipal service requests
          </p>
        </div>

        <Link to="/submit-complaint">
          <Button variant="primary" icon={PlusCircle}>
            Submit New Complaint
          </Button>
        </Link>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="table" />
      ) : (
        <DataTable
          columns={columns}
          data={complaints}
          filterOptions={filterOptions}
          searchPlaceholder="Search by #, Title, Category, Department..."
          onRowClick={(row) => navigate(`/complaints/${row.id}`)}
        />
      )}
    </motion.div>
  );
};

export default ComplaintHistory;
