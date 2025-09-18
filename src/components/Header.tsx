import React, { useState } from 'react';
import { Search, Upload, Menu, User, LogOut } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import AuthModal from './AuthModal';

interface HeaderProps {
  onNavigate: (page: string) => void;
  onSearch: (query: string) => void;
  onToggleSidebar: () => void;
}

export default function Header({ onNavigate, onSearch, onToggleSidebar }: HeaderProps) {
  const { user, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onSearch(searchQuery);
    }
  };

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    onNavigate('home');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-gray-900 border-b border-gray-800 px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Left Section */}
          <div className="flex items-center space-x-4">
            <button
              onClick={onToggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-800 transition-colors lg:hidden"
            >
              <Menu size={20} />
            </button>
            <button 
              onClick={() => onNavigate('home')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">YT</span>
              </div>
              <span className="text-xl font-bold hidden sm:block">MiniTube</span>
            </button>
          </div>

          {/* Center Search */}
          <div className="flex-1 max-w-2xl mx-8">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search videos..."
                className="w-full px-4 py-2 pr-12 bg-gray-800 border border-gray-700 rounded-full 
                         focus:border-red-600 focus:outline-none text-white placeholder-gray-400"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                         hover:text-white transition-colors"
              >
                <Search size={18} />
              </button>
            </form>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <button
                  onClick={() => onNavigate('upload')}
                  className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 
                           rounded-lg transition-colors"
                >
                  <Upload size={16} />
                  <span className="hidden sm:block">Upload</span>
                </button>
                
                <div className="relative">
                  <button
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="w-8 h-8 rounded-full overflow-hidden hover:ring-2 hover:ring-red-600 
                             transition-all"
                  >
                    <img
                      src={user.avatar}
                      alt={user.username}
                      className="w-full h-full object-cover"
                    />
                  </button>
                  
                  {showUserMenu && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 
                                  rounded-lg shadow-xl">
                      <div className="p-3 border-b border-gray-700">
                        <p className="font-medium">{user.username}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <button
                          onClick={() => {
                            onNavigate('dashboard');
                            setShowUserMenu(false);
                          }}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left 
                                   hover:bg-gray-700 rounded transition-colors"
                        >
                          <User size={16} />
                          <span>Dashboard</span>
                        </button>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-left 
                                   hover:bg-gray-700 rounded transition-colors"
                        >
                          <LogOut size={16} />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-2 px-4 py-2 border border-red-600 text-red-600 
                         hover:bg-red-600 hover:text-white rounded-lg transition-colors"
              >
                <User size={16} />
                <span>Sign In</span>
              </button>
            )}
          </div>
        </div>
      </header>

      {showAuthModal && (
        <AuthModal onClose={() => setShowAuthModal(false)} onNavigate={onNavigate} />
      )}
    </>
  );
}