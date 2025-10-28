import React, { useState, useEffect } from 'react';
import AdminGallery from './AdminGallery';
import AdminSchedule from './AdminSchedule';
import AdminInstructors from './AdminInstructors';
import AdminAboutPhoto from './AdminAboutPhoto';
import AdminBreathingVideos from './AdminBreathingVideos';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('gallery');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Check authentication on mount
  useEffect(() => {
    const authStatus = localStorage.getItem('adminAuth');
    if (authStatus === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Simple password authentication (in production, use proper auth)
      const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'coldtherapy2024';
      
      if (password === ADMIN_PASSWORD) {
        setIsAuthenticated(true);
        localStorage.setItem('adminAuth', 'true');
        localStorage.setItem('adminAuthTime', Date.now().toString());
        alert('✅ Login successful!');
      } else {
        alert('❌ Invalid password. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('❌ Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setPassword('');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminAuthTime');
    alert('✅ Logged out successfully!');
  };

  // Check if session expired (24 hours)
  useEffect(() => {
    if (isAuthenticated) {
      const authTime = localStorage.getItem('adminAuthTime');
      if (authTime) {
        const timeDiff = Date.now() - parseInt(authTime);
        const hoursDiff = timeDiff / (1000 * 60 * 60);
        
        if (hoursDiff > 24) {
          handleLogout();
        }
      }
    }
  }, [isAuthenticated]);

  const tabs = [
    { id: 'gallery', label: '🖼️ Gallery', icon: '🖼️' },
    { id: 'schedule', label: '📅 Schedule', icon: '📅' },
    { id: 'instructors', label: '👥 Instructors', icon: '👥' },
    { id: 'about', label: '📸 About Photo', icon: '📸' },
    { id: 'videos', label: '🎬 Breathing Videos', icon: '🎬' },
  ];

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-900 flex items-center justify-center p-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 w-full max-w-md border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">Admin Panel</h1>
            <p className="text-blue-200">Cold Therapy Landing Page</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-white text-sm font-semibold mb-2">
                Admin Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter admin password"
                className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <span className="inline-block animate-spin mr-2">⏳</span>
                  Logging in...
                </>
              ) : (
                '🔐 Login'
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-blue-300 text-sm">
              Contact administrator for access credentials
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-blue-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Admin Panel</h1>
              <span className="ml-4 text-sm text-blue-200">Cold Therapy Landing</span>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-300 rounded-lg hover:bg-red-500/30 transition-all text-sm"
            >
              🚪 Logout
            </button>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-cyan-400 text-cyan-300'
                    : 'border-transparent text-blue-200 hover:text-white hover:border-blue-400/50'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 border border-white/10">
          {activeTab === 'gallery' && <AdminGallery />}
          {activeTab === 'schedule' && <AdminSchedule />}
          {activeTab === 'instructors' && <AdminInstructors />}
          {activeTab === 'about' && <AdminAboutPhoto />}
          {activeTab === 'videos' && <AdminBreathingVideos />}
        </div>
      </div>

      {/* Footer */}
      <div className="mt-auto bg-black/10 backdrop-blur-sm border-t border-white/10 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-blue-300 text-sm">
            Admin Dashboard - Cold Therapy Landing Page
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
