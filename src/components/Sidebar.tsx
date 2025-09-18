import React from 'react';
import { Home, TrendingUp, History, Clock, ThumbsUp, Folder, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onNavigate: (page: string) => void;
  currentPage: string;
}

const menuItems = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'trending', label: 'Trending', icon: TrendingUp },
];

const userMenuItems = [
  { id: 'history', label: 'History', icon: History },
  { id: 'watch-later', label: 'Watch Later', icon: Clock },
  { id: 'liked', label: 'Liked Videos', icon: ThumbsUp },
  { id: 'dashboard', label: 'Your Videos', icon: Folder },
];

export default function Sidebar({ isOpen, onNavigate, currentPage }: SidebarProps) {
  const { user } = useAuth();

  return (
    <aside className={`
      fixed left-0 top-16 h-full bg-gray-900 border-r border-gray-800 transition-all duration-300 z-40
      ${isOpen ? 'w-64' : 'w-16'}
    `}>
      <div className="p-4 space-y-6">
        {/* Main Menu */}
        <div className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`
                  w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                  ${currentPage === item.id 
                    ? 'bg-red-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-800'
                  }
                `}
              >
                <Icon size={20} />
                {isOpen && <span>{item.label}</span>}
              </button>
            );
          })}
        </div>

        {/* User Menu */}
        {user && (
          <>
            {isOpen && <hr className="border-gray-800" />}
            <div className="space-y-2">
              {isOpen && <h3 className="text-sm font-medium text-gray-400 px-3">Your Library</h3>}
              {userMenuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => onNavigate(item.id)}
                    className={`
                      w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
                      ${currentPage === item.id 
                        ? 'bg-red-600 text-white' 
                        : 'text-gray-300 hover:bg-gray-800'
                      }
                    `}
                  >
                    <Icon size={20} />
                    {isOpen && <span>{item.label}</span>}
                  </button>
                );
              })}
            </div>
          </>
        )}

        {/* Settings */}
        {isOpen && <hr className="border-gray-800" />}
        <div className="space-y-2">
          <button
            onClick={() => onNavigate('settings')}
            className={`
              w-full flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors
              ${currentPage === 'settings' 
                ? 'bg-red-600 text-white' 
                : 'text-gray-300 hover:bg-gray-800'
              }
            `}
          >
            <Settings size={20} />
            {isOpen && <span>Settings</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}