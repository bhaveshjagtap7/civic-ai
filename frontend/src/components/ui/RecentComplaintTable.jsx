import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, ChevronLeft, ChevronRight } from 'lucide-react';
import Badge from './Badge';

export const RecentComplaintTable = ({ complaints = [] }) => {
  const navigate = useNavigate();

  const displayData = complaints.length > 0 ? complaints.slice(0, 4) : [
    {
      id: 1,
      complaint_number: 'CIV-2026-1024',
      category: 'Road Maintenance',
      department_name: 'Municipal Corporation',
      status: 'In Progress',
      priority: 'Medium',
      created_at: '30 Jul 2026',
    },
    {
      id: 2,
      complaint_number: 'CIV-2026-1018',
      category: 'Garbage Collection',
      department_name: 'Municipal Corporation',
      status: 'Resolved',
      priority: 'Low',
      created_at: '28 Jul 2026',
    },
    {
      id: 3,
      complaint_number: 'CIV-2026-1015',
      category: 'Water Leakage',
      department_name: 'Water Supply',
      status: 'Pending',
      priority: 'High',
      created_at: '28 Jul 2026',
    },
    {
      id: 4,
      complaint_number: 'CIV-2026-1009',
      category: 'Drainage Issue',
      department_name: 'Municipal Corporation',
      status: 'In Progress',
      priority: 'Medium',
      created_at: '27 Jul 2026',
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-5 shadow-soft space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
          Recent Complaints
        </h3>
        <Link to="/complaints" className="text-xs font-bold text-blue-600 hover:underline">
          View All
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase text-[10px] tracking-wider pb-2">
              <th scope="col" className="py-2.5 px-3">ID</th>
              <th scope="col" className="py-2.5 px-3">Category</th>
              <th scope="col" className="py-2.5 px-3">Department</th>
              <th scope="col" className="py-2.5 px-3">Status</th>
              <th scope="col" className="py-2.5 px-3">Priority</th>
              <th scope="col" className="py-2.5 px-3">Submitted On</th>
              <th scope="col" className="py-2.5 px-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {displayData.map((row) => (
              <tr key={row.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/30 transition-colors">
                <td className="py-3 px-3">
                  <span
                    onClick={() => navigate(`/complaints/${row.id}`)}
                    className="font-bold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
                  >
                    {row.complaint_number}
                  </span>
                </td>
                <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                  {row.category}
                </td>
                <td className="py-3 px-3 text-slate-500 font-medium">
                  {row.department_name}
                </td>
                <td className="py-3 px-3">
                  <Badge variant={row.status}>{row.status}</Badge>
                </td>
                <td className="py-3 px-3">
                  <Badge variant={row.priority}>{row.priority}</Badge>
                </td>
                <td className="py-3 px-3 text-slate-400 font-medium">
                  {row.created_at}
                </td>
                <td className="py-3 px-3 text-center">
                  <button
                    onClick={() => navigate(`/complaints/${row.id}`)}
                    className="p-1.5 rounded-lg border border-blue-200 text-blue-600 hover:bg-blue-50 dark:border-blue-800 dark:text-blue-400 transition-colors inline-flex items-center justify-center"
                    title="View Complaint"
                  >
                    <Eye className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer Pagination */}
      <div className="flex items-center justify-between pt-1 text-xs text-slate-400 font-medium">
        <span>Showing 1 to {displayData.length} of {displayData.length} complaints</span>

        <div className="flex items-center gap-1">
          <button className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="w-6 h-6 rounded-md bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
            1
          </span>
          <button className="p-1 text-slate-300 hover:text-slate-600 disabled:opacity-30" disabled>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecentComplaintTable;
