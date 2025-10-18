import React from 'react';
import { useApp } from '../../contexts/AppContext';

const AdminAuth = () => {
  const { t, password, setPassword, handleLogin } = useApp();

  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-white mb-6 text-center">
        🔐 Admin Login
      </h3>
      <input 
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
        placeholder={t.enterPassword}
        className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 mb-4"
        autoFocus
      />
      <button 
        onClick={handleLogin}
        className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
      >
        {t.login}
      </button>
    </div>
  );
};

export default AdminAuth;
