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
  ChevronLeft,
  ChevronRight,
  Bot,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onOpenAIChat, isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }) => {
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

  const sidebarContent = (
    <div className="flex flex-col justify-between h-full py-4">
      <div className="space-y-6">
        
        {/* User Role Access Banner */}
        <div className={`p-3 bg-gradient-to-r from-slate-900 to-slate-800 text-white rounded-2xl border border-slate-700/80 shadow-md ${isCollapsed ? 'text-center p-2' : ''}`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-blue-600/30 rounded-xl border border-blue-500/30 flex-shrink-0">
              <ShieldAlert className="w-4 h-4 text-blue-400" />
            </div>
            {!isCollapsed && (
              <div className="overflow-hidden">
                <p className="text-[9px] font-bold text-blue-400 uppercase tracking-widest">Portal Access</p>
                <h4 className="font-bold text-xs truncate">{user?.role || 'Citizen'} Desk</h4>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Items */}
        <nav className="space-y-1">
          {!isCollapsed && (
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500 mb-2">
              Main Navigation
            </p>
          )}
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/' || item.path === '/officer' || item.path === '/admin'}
                onClick={onCloseMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-150 relative group ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/70 hover:text-slate-900 dark:hover:text-slate-100'
                  } ${isCollapsed ? 'justify-center px-2' : ''}`
                }
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                {!isCollapsed && <span className="truncate">{item.label}</span>}
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Section: AI Support Card & Collapse Button */}
      <div className="space-y-3 pt-4 border-t border-slate-200/80 dark:border-slate-800">
        {!isCollapsed && (
          <div className="p-3.5 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800/80 dark:to-slate-800/40 border border-blue-200/80 dark:border-slate-700/80 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <div className="p-1.5 bg-blue-600 text-white rounded-xl shadow-xs flex-shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="overflow-hidden">
                <h5 className="font-bold text-xs text-slate-900 dark:text-slate-100 flex items-center gap-1">
                  CivicAI Copilot <Sparkles className="w-3 h-3 text-amber-500 fill-amber-500" />
                </h5>
                <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  Smart complaint routing & support.
                </p>
                <button
                  onClick={onOpenAIChat}
                  className="mt-2 text-[11px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                >
                  Launch Copilot &rarr;
                </button>
              </div>
            </div>
          </div>
        )}

        {/* User Profile Mini Footer & Collapse Toggle */}
        <div className="flex items-center justify-between gap-2 px-1">
          {user && !isCollapsed && (
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-7 h-7 rounded-lg bg-slate-200 dark:bg-slate-700 font-bold text-xs flex items-center justify-center text-slate-700 dark:text-slate-200">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="truncate">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            </div>
          )}

          <button
            onClick={onToggleCollapse}
            className="hidden md:flex p-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors ml-auto"
            title={isCollapsed ? 'Expand Sidebar' : 'Collapse Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside
        className={`hidden md:block bg-white/80 dark:bg-slate-900/80 border-r border-slate-200/80 dark:border-slate-800 backdrop-blur-md transition-all duration-300 min-h-[calc(100vh-4rem)] sticky top-16 ${
          isCollapsed ? 'w-20 px-2' : 'w-64 px-4'
        }`}
      >
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-72 bg-white dark:bg-slate-900 p-4 border-r border-slate-200 dark:border-slate-800 shadow-2xl z-50 overflow-y-auto"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800 mb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-slate-100">Navigation Menu</span>
                <button
                  onClick={onCloseMobile}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              {sidebarContent}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
