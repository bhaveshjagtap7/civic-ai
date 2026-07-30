import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Search, Bot, Phone, HelpCircle } from 'lucide-react';

export const QuickActionGrid = ({ onOpenAIChat }) => {
  const navigate = useNavigate();

  const actions = [
    { title: 'Submit Complaint', subtitle: 'Log a new issue', icon: Plus, color: 'text-blue-600 bg-blue-50', onClick: () => navigate('/submit-complaint') },
    { title: 'Complaint History', subtitle: 'View past submissions', icon: FileText, color: 'text-purple-600 bg-purple-50', onClick: () => navigate('/complaints') },
    { title: 'Track Complaint', subtitle: 'Check live status', icon: Search, color: 'text-teal-600 bg-teal-50', onClick: () => navigate('/complaints') },
    { title: 'AI Assistant', subtitle: 'Ask questions', icon: Bot, color: 'text-purple-600 bg-purple-50', badge: 'AI', onClick: onOpenAIChat || (() => navigate('/submit-complaint')) },
    { title: 'Emergency', subtitle: '24/7 helpline', icon: Phone, color: 'text-red-600 bg-red-50', onClick: () => navigate('/profile') },
    { title: 'Help Center', subtitle: 'Guides & civic info', icon: HelpCircle, color: 'text-amber-600 bg-amber-50', onClick: () => navigate('/profile') },
  ];

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-semibold text-gray-900">Quick Actions</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <motion.button
              key={act.title}
              whileHover={{ y: -1 }}
              whileTap={{ scale: 0.98 }}
              onClick={act.onClick}
              className="p-3 rounded-xl border border-gray-200 bg-white text-left hover:bg-gray-50 transition-colors flex flex-col gap-2"
            >
              <div className={`w-8 h-8 rounded-lg ${act.color} flex items-center justify-center flex-shrink-0`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-1">
                  <p className="text-xs font-semibold text-gray-900 truncate">{act.title}</p>
                  {act.badge && (
                    <span className="text-[9px] font-bold px-1 rounded bg-purple-100 text-purple-700">{act.badge}</span>
                  )}
                </div>
                <p className="text-[10px] text-gray-400 mt-0.5 truncate">{act.subtitle}</p>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default QuickActionGrid;
