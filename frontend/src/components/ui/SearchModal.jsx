import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, LayoutDashboard, PlusCircle, FileText, User, BarChart3, Users, Building2, Settings } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const SearchModal = ({ isOpen, onClose, onOpenAIChat }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const citizenRoutes = [
    { label: 'Citizen Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Submit New Complaint', path: '/submit-complaint', icon: PlusCircle },
    { label: 'My Complaint History', path: '/complaints', icon: FileText },
    { label: 'My Profile', path: '/profile', icon: User },
  ];

  const officerRoutes = [
    { label: 'Officer Desk Overview', path: '/officer', icon: LayoutDashboard },
    { label: 'Assigned Complaints', path: '/officer/complaints', icon: FileText },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminRoutes = [
    { label: 'Admin Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Analytics & SLA Metrics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Manage Users & Officers', path: '/admin/users', icon: Users },
    { label: 'Manage Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Manage Complaints', path: '/admin/complaints', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const allRoutes = user?.role === 'Admin' ? adminRoutes : user?.role === 'Officer' ? officerRoutes : citizenRoutes;

  const filteredRoutes = allRoutes.filter((item) =>
    item.label.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = (path) => {
    navigate(path);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 px-4">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-2xl shadow-2xl overflow-hidden glass-card">
        <div className="flex items-center gap-3 px-4 py-3 border-b border-slate-100 dark:border-slate-800">
          <Search className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          <input
            type="text"
            placeholder="Type a command or search pages..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-sm font-medium text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
          />
          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-2 max-h-80 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/40">
          <div className="p-2">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1">
              Navigation Commands
            </p>
            {filteredRoutes.length === 0 ? (
              <p className="px-3 py-4 text-xs text-slate-400 text-center">No matching commands</p>
            ) : (
              filteredRoutes.map((route) => {
                const Icon = route.icon;
                return (
                  <button
                    key={route.path}
                    onClick={() => handleSelect(route.path)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-blue-50 dark:hover:bg-blue-950/40 hover:text-blue-600 dark:hover:text-blue-400 transition-colors text-left"
                  >
                    <Icon className="w-4 h-4 text-slate-400" />
                    <span>{route.label}</span>
                  </button>
                );
              })
            )}
          </div>
        </div>

        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
          <span>Navigate with mouse or arrow keys</span>
          <kbd className="px-1.5 py-0.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded font-mono">
            ESC to close
          </kbd>
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
