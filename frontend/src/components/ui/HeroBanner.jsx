import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle2, Clock, ShieldCheck, Shield } from 'lucide-react';

export const HeroBanner = () => {
  const { user } = useAuth();

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const citizenId = user?.id ? `CIT-${user.id}` : 'CIT-6';

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        {/* Left */}
        <div className="space-y-3">
          <div>
            <h2 className="text-xl font-bold text-gray-900">
              {getGreeting()}, {user?.name || 'User'}! 👋
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">
              Here to help you voice your concerns and make your city better.
            </p>
          </div>

          <div className="inline-flex items-center gap-2.5 px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg">
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center flex-shrink-0">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-[10px] font-medium text-gray-400">Citizen ID</p>
              <p className="text-xs font-bold text-gray-900 font-mono">#{citizenId}</p>
            </div>
          </div>
        </div>

        {/* Right: Status */}
        <div className="flex flex-col gap-2.5 text-xs text-gray-600">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
            <div>
              <p className="font-semibold text-gray-900">All Services Operational</p>
              <p className="text-gray-400 text-[10px]">Municipal systems running normally</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-gray-400 flex-shrink-0" />
            <span>SLA Target: <strong className="text-gray-900">24h</strong></span>
          </div>
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-500 flex-shrink-0" />
            <span>AI Routing: <strong className="text-gray-900">Active</strong></span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroBanner;
