import React from 'react';
import { useApp } from '../../contexts/AppContext';

const AdminAuth = () => {
  const { t, adminEmail, setAdminEmail, adminPassword, setAdminPassword, handleAdminLogin } = useApp();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">🔐 Admin Login</h3>
      <input
        type="email"
        value={adminEmail || ''}
        onChange={(e) => setAdminEmail(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
        placeholder="Admin Email"
        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 mb-4"
        autoFocus
      />
      <input
        type="password"
        value={adminPassword || ''}
        onChange={(e) => setAdminPassword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleAdminLogin()}
        placeholder={t.enterPassword}
        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 mb-4"
      />
      <button
        onClick={handleAdminLogin}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
      >
        {t.login}
      </button>
    </div>
  );
};

export default AdminAuth;
