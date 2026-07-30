import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import api from '../../services/api';
import SkeletonLoader from '../../components/common/SkeletonLoader';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import DataTable from '../../components/ui/DataTable';
import { motion } from 'framer-motion';

const AssignedComplaints = () => {
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
      header: 'Ticket #',
      key: 'complaint_number',
      sortable: true,
      render: (val) => (
        <span className="font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-lg border border-amber-200 dark:border-amber-800 text-[11px]">
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
          <p className="text-[11px] text-slate-500 dark:text-slate-400">By {row.citizen_name || 'Citizen'} &bull; {row.location || 'Location Not Specified'}</p>
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
          variant="secondary"
          size="sm"
          onClick={(e) => {
            e.stopPropagation();
            navigate(`/officer/complaint/${val}`);
          }}
          icon={ArrowRight}
        >
          Manage
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
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-slate-100 tracking-tight">
          Assigned Department Desk
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
          Manage, inspect, and update field resolution status for assigned civic tickets
        </p>
      </div>

      {loading ? (
        <SkeletonLoader count={4} type="table" />
      ) : (
        <DataTable
          columns={columns}
          data={complaints}
          filterOptions={filterOptions}
          searchPlaceholder="Search by ticket #, description, citizen name..."
          onRowClick={(row) => navigate(`/officer/complaint/${row.id}`)}
        />
      )}
    </motion.div>
  );
};

export default AssignedComplaints;
