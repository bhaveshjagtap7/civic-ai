import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIChatDrawer from '../common/AIChatDrawer';

const MainLayout = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
      <Navbar onOpenAIChat={() => setIsAIChatOpen(true)} />
      <div className="flex-1 flex max-w-7xl w-full mx-auto">
        <Sidebar onOpenAIChat={() => setIsAIChatOpen(true)} />
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-y-auto">
          <Outlet />
        </main>
      </div>
      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
    </div>
  );
};

export default MainLayout;
