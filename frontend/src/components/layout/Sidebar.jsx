import React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard, PlusCircle, FileText, Search, User,
  Settings, Shield, X, ChevronRight, CheckSquare,
  BarChart3, Users, Building2, Sparkles,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({ onOpenAIChat, isMobileOpen, onCloseMobile }) => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const role = user?.role || 'Citizen';

  const citizenNav = [
    { label: 'Dashboard', path: '/', icon: LayoutDashboard },
    { label: 'Submit Complaint', path: '/submit-complaint', icon: PlusCircle },
    { label: 'Complaint History', path: '/complaints', icon: FileText },
    { label: 'Track Complaint', path: '/complaints', icon: Search },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const officerNav = [
    { label: 'Dashboard', path: '/officer', icon: LayoutDashboard },
    { label: 'Assigned Complaints', path: '/officer/complaints', icon: CheckSquare },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const adminNav = [
    { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { label: 'Analytics', path: '/admin/analytics', icon: BarChart3 },
    { label: 'Users & Officers', path: '/admin/users', icon: Users },
    { label: 'Departments', path: '/admin/departments', icon: Building2 },
    { label: 'Complaints', path: '/admin/complaints', icon: FileText },
    { label: 'Settings', path: '/admin/settings', icon: Settings },
    { label: 'Profile', path: '/profile', icon: User },
  ];

  const currentNav = role === 'Admin' ? adminNav : role === 'Officer' ? officerNav : citizenNav;

  const content = (
    <div className="flex flex-col justify-between flex-1 space-y-4">
      <div className="space-y-4 overflow-y-auto pr-1">
        {/* Brand Header (Compact Height) */}
        <div className="flex items-center gap-3 py-1">
          <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-xs flex-shrink-0">
            <Shield className="w-[18px] h-[18px]" />
          </div>
          <div>
            <h2 className="font-extrabold text-base text-slate-900 tracking-tight leading-none">
              CivicAI
            </h2>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mt-0.5">
              {role} Portal
            </span>
          </div>
        </div>

        {/* AI Quick Trigger (Compact 44px Height) */}
        <button
          onClick={onOpenAIChat}
          className="w-full h-[44px] px-3 bg-blue-50/80 border border-blue-100 hover:border-blue-200 text-blue-600 rounded-xl text-xs font-bold flex items-center justify-between transition-all cursor-pointer shadow-xs"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-[18px] h-[18px] text-blue-600" />
            <span>AI Assistant</span>
          </div>
          <span className="text-[10px] bg-blue-600 text-white px-2 py-0.5 rounded font-extrabold">ASK</span>
        </button>

        {/* Navigation Menu (44px item height, 18px icon size) */}
        <div>
          <p className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 mb-1.5 px-1">
            Navigation Menu
          </p>
          <div className="space-y-1">
            {currentNav.map((item) => {
              const Icon = item.icon;
              const active = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path) && item.path !== '/';

              return (
                <NavLink
                  key={item.label}
                  to={item.path}
                  onClick={onCloseMobile}
                  className={`flex items-center justify-between px-3 h-[44px] rounded-xl font-bold text-xs transition-all duration-150 group ${
                    active
                      ? 'bg-blue-50 text-blue-600 border border-blue-100 shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-blue-600' : 'text-slate-400 group-hover:text-slate-600'}`} />
                    <span>{item.label}</span>
                  </div>
                </NavLink>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Profile Section (Compact height) */}
      <div className="pt-3 border-t border-slate-200">
        <button
          onClick={() => navigate('/profile')}
          className="w-full flex items-center justify-between gap-2.5 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 cursor-pointer hover:bg-slate-100 transition-colors text-left"
        >
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-extrabold text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
              {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-slate-900 truncate">{user?.name || 'Rahul Sharma'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.role || 'Officer'}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0" />
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar: 256px Width, Sticky Top, 100vh Height, White BG, Border Slate-200 */}
      <aside className="hidden lg:flex flex-col w-[256px] h-screen sticky top-0 bg-white border-r border-slate-200 p-4 shrink-0 z-40 overflow-y-auto">
        {content}
      </aside>

      {/* Mobile Drawer Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onCloseMobile}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs"
            />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 w-[256px] bg-white p-4 border-r border-slate-200 shadow-xl z-50 overflow-y-auto flex flex-col"
            >
              <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3">
                <span className="font-bold text-sm text-slate-900">CivicAI Menu</span>
                <button onClick={onCloseMobile} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400">
                  <X className="w-5 h-5" />
                </button>
              </div>
              {content}
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Sidebar;
