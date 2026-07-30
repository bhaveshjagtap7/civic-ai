import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import AIChatDrawer from '../common/AIChatDrawer';
import SearchModal from '../ui/SearchModal';

const AppLayout = () => {
  const [isAIChatOpen, setIsAIChatOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="h-screen overflow-hidden bg-slate-50 text-slate-900 flex font-sans antialiased">
      {/* Sidebar (Width 256px, Sticky 100vh, White Background, Border Slate-200) */}
      <Sidebar
        onOpenAIChat={() => setIsAIChatOpen(true)}
        isMobileOpen={isMobileMenuOpen}
        onCloseMobile={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Viewport Container */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        {/* Topbar (Height 72px) */}
        <Navbar
          onOpenAIChat={() => setIsAIChatOpen(true)}
          onOpenSearch={() => setIsSearchOpen(true)}
          onToggleMobileSidebar={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        />

        {/* Scrollable Content Container (Max Width 1440px, Padding 24px) */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-[1440px] w-full mx-auto px-6 py-6 space-y-6">
            <Outlet context={{ onOpenAIChat: () => setIsAIChatOpen(true), onOpenSearch: () => setIsSearchOpen(true) }} />

            {/* Footer positioned after main content, not stuck to viewport */}
            <footer className="mt-8 pt-4 pb-2 border-t border-slate-200 text-center text-xs text-slate-500 font-medium">
              <p>© 2026 CivicAI — Municipal Service Automation & Grievance Governance Platform</p>
            </footer>
          </div>
        </main>
      </div>

      <AIChatDrawer isOpen={isAIChatOpen} onClose={() => setIsAIChatOpen(false)} />
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} onOpenAIChat={() => setIsAIChatOpen(true)} />
    </div>
  );
};

export default AppLayout;
