import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Coins,
  History,
  Gem,
  Info,
  Layers,
  Sparkles,
} from 'lucide-react';
import { cn } from '../../lib/cn';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

const navItems = [
  {
    path: '/',
    label: 'Overview',
    icon: LayoutDashboard,
    badge: null,
  },
  {
    path: '/gold',
    label: 'Gold (Au)',
    icon: Coins,
    badge: '24K/22K/18K',
    accentColor: 'text-amber-500',
  },
  {
    path: '/silver',
    label: 'Silver (Ag)',
    icon: Layers,
    badge: '999',
    accentColor: 'text-slate-400',
  },
  {
    path: '/platinum',
    label: 'Platinum (Pt)',
    icon: Sparkles,
    badge: '950',
    accentColor: 'text-sky-400',
  },
  {
    path: '/palladium',
    label: 'Palladium (Pd)',
    icon: Sparkles,
    badge: '950',
    accentColor: 'text-purple-400',
  },
  {
    path: '/history',
    label: 'Price History',
    icon: History,
    badge: null,
  },
  {
    path: '/diamond-guide',
    label: 'Diamond Guide',
    icon: Gem,
    badge: '4Cs Guide',
  },
  {
    path: '/about',
    label: 'About & Sources',
    icon: Info,
    badge: null,
  },
];

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  return (
    <aside
      className={cn(
        'w-64 h-full bg-surface border-r border-border flex flex-col justify-between select-none z-30',
        className
      )}
    >
      <div>
        {/* Brand Logo & Title */}
        <div className="p-5 border-b border-border flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-gold-400 to-gold-600 flex items-center justify-center shadow-md shadow-gold-500/10 text-slate-950 font-black text-lg">
            <Coins className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-text-primary">MetalPrice</span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-gold-500/15 text-gold-500 border border-gold-500/20">
                IN
              </span>
            </div>
            <p className="text-[11px] text-text-muted">India Precious Metals</p>
          </div>
        </div>

        {/* Navigation Items */}
        <div className="px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-semibold uppercase tracking-wider text-text-muted">
            Markets & Analytics
          </div>
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onNavigate}
              className={({ isActive }) =>
                cn(
                  'flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-gold-500/10 text-gold-600 dark:text-gold-400 font-semibold shadow-xs border border-gold-500/20'
                    : 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated'
                )
              }
            >
              <div className="flex items-center gap-3">
                <item.icon
                  className={cn(
                    'w-4 h-4 transition-colors',
                    item.accentColor || 'text-text-muted group-hover:text-text-primary'
                  )}
                />
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-surface-elevated text-text-muted border border-border group-hover:border-border-strong font-mono">
                  {item.badge}
                </span>
              )}
            </NavLink>
          ))}
        </div>
      </div>

      {/* Bottom Phase Card */}
      <div className="p-4 m-3 rounded-xl bg-surface-subtle border border-border/80 text-xs">
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-semibold text-text-primary">Phase 1: UI Foundation</span>
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
        </div>
        <p className="text-[11px] text-text-muted leading-relaxed">
          Precious metals frontend shell with deterministic simulation data.
        </p>
        <div className="mt-3 pt-2 border-t border-border flex items-center justify-between text-[11px] text-text-secondary">
          <span>Target Market</span>
          <span className="font-medium text-text-primary">India (INR)</span>
        </div>
      </div>
    </aside>
  );
};
