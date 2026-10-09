import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';
import { MobileNav } from './MobileNav';
import { useTheme } from '../../hooks/useTheme';
import { usePriceData } from '../../hooks/usePriceData';

export const AppLayout: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { refreshPrices, isRefreshing, isDemo } = usePriceData();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const [prevPath, setPrevPath] = useState(location.pathname);

  // Close mobile drawer on route change during render
  if (location.pathname !== prevPath) {
    setPrevPath(location.pathname);
    setIsMobileMenuOpen(false);
  }

  return (
    <div className="min-h-screen bg-background text-text-primary flex flex-col antialiased">
      {/* Top Bar for both desktop and mobile */}
      <TopBar
        theme={theme}
        onToggleTheme={toggleTheme}
        onRefreshData={refreshPrices}
        isRefreshing={isRefreshing}
        isDemo={isDemo}
        isMobileMenuOpen={isMobileMenuOpen}
        onToggleMobileMenu={() => setIsMobileMenuOpen((prev) => !prev)}
      />

      <div className="flex-1 flex w-full">
        {/* Desktop Fixed Left Sidebar */}
        <div className="hidden md:block w-64 shrink-0">
          <div className="fixed top-16 bottom-0 w-64">
            <Sidebar />
          </div>
        </div>

        {/* Mobile Sidebar Overlay Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] bg-surface z-50 shadow-2xl">
              <Sidebar onNavigate={() => setIsMobileMenuOpen(false)} />
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 flex flex-col min-w-0 pb-20 md:pb-8">
          <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
            <Outlet />
          </div>

          {/* Footer */}
          <footer className="mt-auto border-t border-border/80 py-6 px-4 sm:px-6 lg:px-8 bg-surface/50 text-xs text-text-muted">
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="font-semibold text-text-primary">MetalPrice &mdash; India Precious Metals Tracking</p>
                <p className="mt-0.5 text-[11px]">
                  {isDemo
                    ? 'Connected to local fallback demonstration fixtures.'
                    : 'Connected to live Supabase PostgreSQL observation database.'}
                </p>
              </div>
              <div className="flex items-center gap-4 text-[11px] text-text-secondary">
                <span>Timezone: Asia/Kolkata (IST)</span>
                <span>&bull;</span>
                <span>Currency: INR (₹)</span>
                <span>&bull;</span>
                <span className="text-gold-500 font-medium">Production Ready</span>
              </div>
            </div>
          </footer>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <MobileNav />
    </div>
  );
};
