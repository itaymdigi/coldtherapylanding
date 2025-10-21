import React, { useEffect } from 'react';
import { Outlet, useLocation } from '@tanstack/react-router';
import { useApp } from '../contexts/AppContext';
import Header from './Header';
import AdminPanelNew from './admin/AdminPanelNew';
import Background from './Background';
import InstallPrompt from './InstallPrompt';
import AIChatWidget from './AIChatWidget';
import ErrorBoundary from './ErrorBoundary';

const Layout = () => {
  const { language, audioRef, isPlaying, showAdmin, t } = useApp();
  const location = useLocation();

  // Handle hash navigation
  useEffect(() => {
    if (location.hash) {
      // Wait for page to render
      setTimeout(() => {
        const element = document.querySelector(location.hash);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  }, [location.hash, location.pathname]);

  return (
    <div
      className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-900 scroll-smooth"
      dir={language === 'he' ? 'rtl' : 'ltr'}
    >
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source
          src="https://www.bensound.com/bensound-music/bensound-relaxing.mp3"
          type="audio/mpeg"
        />
      </audio>

      {/* Admin Panel */}
      {showAdmin && (
        <ErrorBoundary>
          <AdminPanelNew />
        </ErrorBoundary>
      )}

      {/* PWA Install Prompt */}
      <InstallPrompt />

      {/* AI Chat Widget */}
      <AIChatWidget />

      {/* 3D Background */}
      <Background />

      {/* Header */}
      <Header />

      {/* Main Content */}
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>

      {/* Footer */}
      <footer className="relative z-20 py-8 px-4 bg-gradient-to-t from-slate-900 to-transparent border-t border-cyan-400/10">
        <div className="max-w-6xl mx-auto text-center">
          <p className="text-blue-200 mb-2">{t.footer}</p>
          <p className="text-cyan-400 text-sm">{t.footerTagline}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
