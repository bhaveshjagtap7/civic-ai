import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  PlusCircle,
  FileText,
  User,
  CheckSquare,
  BarChart3,
  Users,
  Building2,
  Settings,
  Sparkles,
  ShieldAlert,
  Bot
} from 'lucide-react';

const Sidebar = ({ onOpenAIChat }) => {
  const { user } = useAuth();

  const citizenNav = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Submit Complaint', path: '/submit-complaint', icon: PlusCircle },
    { label: 'Complaint History', path: '/complaints', icon: FileText },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const officerNav = [
    { label: 'Officer Desk', path: '/officer', icon: LayoutDashboard },
    { label: 'Assigned Complaints', path: '/officer/complaints', icon: CheckSquare },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const adminNav = [
    { label: 'Admin Overview', path: '/admin', icon: LayoutDashboard },
    { label: 'Analytics & SLA', path: '/admin/analytics', icon: BarChart3 },
    { label: 'User & Officers', path: '/admin/users', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'All Complaints', path: '/admin/complaints', icon: FileText },
    { label: 'System Settings', path: '/admin/settings', icon: Settings },
    { label: 'My Profile', path: '/profile', icon: User }
  ];

  const navItems = user?.role === 'Admin' ? adminNav : user?.role === 'Officer' ? officerNav : citizenNav;

  return (
    <aside className="w-64 bg-white/70 dark:bg-slate-900/70 border-r border-slate-200/80 dark:border-slate-800 flex flex-col justify-between p-4 backdrop-blur-md transition-colors hidden md:flex min-h-[calc(100vh-4rem)]">
      <div className="space-y-6">
        {/* User Role Banner */}
        <div className="p-3.5 bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-2xl shadow-md">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/10 rounded-xl backdrop-blur-md">
              <ShieldAlert className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <p className="text-xs font-semibold text-brand-100 uppercase tracking-wider">Portal Access</p>
              <h4 className="font-bold text-sm">{user?.role || 'Citizen'} Desk</h4>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1.5">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
            Main Menu
          </p>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/officer' || item.path === '/admin'}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all ${
                    isActive
                      ? 'bg-brand-600 text-white shadow-md shadow-brand-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-slate-100'
                  }`
                }
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* AI Assistant Widget Card */}
      <div className="p-4 bg-gradient-to-br from-brand-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800 border border-brand-200/80 dark:border-slate-700 rounded-2xl relative overflow-hidden">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-brand-600 text-white rounded-xl shadow-xs">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
              AI Support <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
            </h5>
            <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5 leading-snug">
              Need help tracking or filing a ticket?
            </p>
            <button
              onClick={onOpenAIChat}
              className="mt-2 text-xs font-bold text-brand-600 dark:text-brand-400 hover:underline flex items-center gap-1"
            >
              Launch Chat Assistant &rarr;
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
