import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Coins, Layers, History, Gem, Info } from 'lucide-react';
import { cn } from '../../lib/cn';

const mobileNavItems = [
  { path: '/', label: 'Overview', icon: LayoutDashboard },
  { path: '/gold', label: 'Gold', icon: Coins },
  { path: '/silver', label: 'Silver', icon: Layers },
  { path: '/history', label: 'History', icon: History },
  { path: '/diamond-guide', label: 'Diamond', icon: Gem },
  { path: '/about', label: 'About', icon: Info },
];

export const MobileNav: React.FC = () => {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-surface/95 backdrop-blur-lg border-t border-border px-2 py-1.5 flex items-center justify-around">
      {mobileNavItems.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          end={item.path === '/'}
          className={({ isActive }) =>
            cn(
              'flex flex-col items-center justify-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors',
              isActive
                ? 'text-gold-500 font-semibold'
                : 'text-text-muted hover:text-text-primary'
            )
          }
        >
          <item.icon className="w-5 h-5 mb-0.5" />
          <span>{item.label}</span>
        </NavLink>
      ))}
    </nav>
  );
};
