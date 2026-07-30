import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Bell, Search, ChevronDown, User, LogOut, Menu, Sparkles } from 'lucide-react';

const Navbar = ({ onOpenAIChat, onOpenSearch, onToggleMobileSidebar }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [showNotif, setShowNotif] = useState(false);

  const handleLogout = () => {
    setShowProfile(false);
    logout();
    navigate('/login');
  };

  return (
    <header className="h-[72px] shrink-0 bg-white border-b border-slate-200 px-6 sm:px-8 flex items-center justify-between gap-4 z-30">
      {/* Left Toolbar */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileSidebar}
          className="lg:hidden p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Global Search Quick Launcher */}
        <button
          onClick={onOpenSearch}
          className="hidden sm:flex items-center gap-2.5 px-3.5 h-[44px] bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-xl text-xs font-medium text-slate-500 transition-all w-64"
        >
          <Search className="w-4 h-4 text-slate-400" />
          <span>Search platform...</span>
          <span className="ml-auto text-[10px] font-bold border border-slate-200 rounded px-1.5 py-0.5 bg-white text-slate-400">⌘K</span>
        </button>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        {/* AI Assistant Quick Launcher */}
        <button
          onClick={onOpenAIChat}
          className="hidden sm:flex items-center gap-2 px-3.5 h-[44px] rounded-xl bg-blue-50 text-blue-600 text-xs font-bold hover:bg-blue-100 transition-colors border border-blue-100"
        >
          <Sparkles className="w-4 h-4 text-blue-600" />
          <span>AI Support</span>
        </button>

        {/* Notification Bell Dropdown */}
        <div className="relative">
          <button
            onClick={() => { setShowNotif(!showNotif); setShowProfile(false); }}
            className="relative h-[44px] w-[44px] flex items-center justify-center rounded-xl text-slate-600 hover:bg-slate-100 transition-colors border border-slate-200"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-blue-600 rounded-full ring-2 ring-white" />
          </button>

          {showNotif && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
              <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <span className="text-xs font-bold text-slate-900">Notifications</span>
                <span className="text-[10px] bg-blue-50 text-blue-600 font-extrabold px-2 py-0.5 rounded-md border border-blue-100">2 New</span>
              </div>
              <div className="divide-y divide-slate-100 text-xs">
                <div className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors">
                  <p className="font-bold text-slate-900">Complaint #CIV-1024 Assigned</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Roads Department • 2 mins ago</p>
                </div>
                <div className="p-3.5 hover:bg-slate-50 cursor-pointer transition-colors">
                  <p className="font-bold text-slate-900">Complaint #CIV-1018 Resolved</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Sanitation Ward • 1 hour ago</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="w-px h-6 bg-slate-200" />

        {/* Profile Dropdown */}
        {user && (
          <div className="relative">
            <button
              onClick={() => { setShowProfile(!showProfile); setShowNotif(false); }}
              className="flex items-center gap-2.5 h-[44px] px-3 rounded-xl hover:bg-slate-100 transition-colors border border-slate-200 bg-slate-50/50"
            >
              <div className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-extrabold flex items-center justify-center shadow-xs">
                {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-bold text-slate-900 leading-tight">{user.name}</p>
                <p className="text-[10px] font-semibold text-slate-500">{user.role}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 top-full mt-2 w-52 bg-white border border-slate-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
                  <p className="text-xs font-bold text-slate-900">{user.name}</p>
                  <p className="text-[10px] text-slate-500 truncate mt-0.5">{user.email}</p>
                </div>
                <div className="p-1">
                  <Link
                    to="/profile"
                    onClick={() => setShowProfile(false)}
                    className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-xl transition-colors"
                  >
                    <User className="w-4 h-4 text-slate-400" /> Profile & Account
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
