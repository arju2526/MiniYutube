import React, { useState, useEffect } from 'react';
import { X, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface AuthModalProps {
  onClose: () => void;
  onNavigate: (page: string) => void;
}

declare global {
  interface Window { google?: any }
}

export default function AuthModal({ onClose, onNavigate }: AuthModalProps) {
  const { login, register, loginWithGoogle } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    username: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      let success = false;
      
      if (isLogin) {
        success = await login(formData.email, formData.password);
      } else {
        success = await register(formData.email, formData.password, formData.username);
      }

      if (success) {
        onClose();
        onNavigate('home');
      } else {
        setError(isLogin ? 'Invalid credentials' : 'Registration failed');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') {
          return; // Do not initialize without a real client ID
        }
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response: any) => {
            setLoading(true);
            setError('');
            const ok = await loginWithGoogle(response.credential);
            setLoading(false);
            if (ok) {
              onClose();
              onNavigate('home');
            } else {
              setError('Google sign-in failed');
            }
          },
          ux_mode: 'popup'
        });
      } catch {}
    }
  }, [loginWithGoogle, onClose, onNavigate]);

  useEffect(() => {
    if (window.google && window.google.accounts && window.google.accounts.id) {
      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';
        if (!clientId || clientId === 'YOUR_GOOGLE_CLIENT_ID') return;
        const el = document.getElementById('googleSignInBtn');
        if (el) {
          window.google.accounts.id.renderButton(el, {
            theme: 'filled_black',
            size: 'large',
            text: 'continue_with',
            shape: 'pill'
          });
        }
      } catch {}
    }
  }, [isLogin]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md mx-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold">
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-700 rounded transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="username" className="block text-sm font-medium mb-2">
                Username
              </label>
              <input
                type="text"
                id="username"
                value={formData.username}
                onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
                className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:border-red-600 focus:outline-none"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg 
                       focus:border-red-600 focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                value={formData.password}
                onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                className="w-full px-3 py-2 pr-10 bg-gray-700 border border-gray-600 rounded-lg 
                         focus:border-red-600 focus:outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 
                         hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 
                     rounded-lg font-medium transition-colors"
          >
            {loading ? 'Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="mt-4">
          <div className="flex items-center">
            <div className="flex-1 h-px bg-gray-700" />
            <span className="px-3 text-gray-400 text-sm">or</span>
            <div className="flex-1 h-px bg-gray-700" />
          </div>
          <div className="mt-4 flex justify-center">
            <div id="googleSignInBtn"></div>
          </div>
        </div>

        <div className="mt-6 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-red-400 hover:text-red-300 text-sm"
          >
            {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
          </button>
        </div>
      </div>
    </div>
  );
}