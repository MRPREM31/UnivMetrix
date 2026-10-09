import React, { useState, useEffect } from 'react';
import {
  Sun,
  Moon,
  RotateCw,
  Menu,
  X,
  Clock,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { LiveDataStatusChip } from '../ui/DisclaimerBanner';
import { getKolkataDateString, getKolkataTimeString } from '../../lib/time';

interface TopBarProps {
  onToggleMobileMenu?: () => void;
  isMobileMenuOpen?: boolean;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  onRefreshData: () => void;
  isRefreshing: boolean;
  isDemo?: boolean;
}

export const TopBar: React.FC<TopBarProps> = ({
  onToggleMobileMenu,
  isMobileMenuOpen,
  theme,
  onToggleTheme,
  onRefreshData,
  isRefreshing,
  isDemo = true,
}) => {
  const [currentTime, setCurrentTime] = useState<string>(getKolkataTimeString());
  const [currentDate, setCurrentDate] = useState<string>(getKolkataDateString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(getKolkataTimeString());
      setCurrentDate(getKolkataDateString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <header className="h-16 bg-surface/90 backdrop-blur-md border-b border-border sticky top-0 z-20 px-4 sm:px-6 flex items-center justify-between gap-4">
      {/* Left: Mobile hamburger & Page Title / Quick info */}
      <div className="flex items-center gap-3">
        <button
          onClick={onToggleMobileMenu}
          className="p-2 -ml-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-surface-elevated md:hidden cursor-pointer"
          aria-label={isMobileMenuOpen ? 'Close Menu' : 'Open Menu'}
        >
          {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>

        {/* Live IST clock */}
        <div className="hidden lg:flex items-center gap-2 text-xs text-text-muted bg-surface-elevated/70 px-3 py-1.5 rounded-lg border border-border">
          <Clock className="w-3.5 h-3.5 text-gold-500" />
          <span className="font-medium text-text-primary">{currentTime}</span>
          <span className="text-text-muted">IST &middot; {currentDate}</span>
        </div>

        <div className="hidden sm:block">
          <LiveDataStatusChip isDemo={isDemo} />
        </div>
      </div>

      {/* Right: Actions (Refresh, Theme toggle) */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Demo Data Refresh Button (only relevant when demo fallback is used) */}
        {isDemo && (
          <Button
            variant="secondary"
            size="sm"
            onClick={onRefreshData}
            isLoading={isRefreshing}
            className="text-xs gap-1.5"
            title="Simulate real-time tick fluctuation for demo dataset"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            <span className="hidden xs:inline sm:inline">Refresh Demo</span>
          </Button>
        )}

        {/* Theme Toggle Button */}
        <button
          onClick={onToggleTheme}
          className="p-2 rounded-lg border border-border bg-surface-elevated text-text-secondary hover:text-text-primary hover:border-border-strong transition-all duration-150 cursor-pointer"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400 hover:rotate-45 transition-transform" />
          ) : (
            <Moon className="w-4 h-4 text-slate-700 hover:-rotate-12 transition-transform" />
          )}
        </button>
      </div>
    </header>
  );
};
