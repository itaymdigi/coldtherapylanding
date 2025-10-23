import { Outlet } from '@tanstack/react-router';
import { useApp } from '../contexts/AppContext';
import AIChatWidget from './AIChatWidget';
import AdminPanelNew from './admin/AdminPanelNew';
import Background from './Background';
import ErrorBoundary from './ErrorBoundary';
import FloatingSocialButtons from './FloatingSocialButtons';
import Header from './Header';
import InstallPrompt from './InstallPrompt';

const Layout = () => {
  const { language, audioRef, showAdmin, t } = useApp();

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
        <track kind="captions" srcLang="en" label="Background Music" />
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

      {/* Floating Social Buttons - Mobile Only */}
      <FloatingSocialButtons />

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
          <p className="text-blue-200 mb-2">{t?.footer || '© 2025 Cold Therapy by Dan Hayat. All rights reserved.'}</p>
          <p className="text-cyan-400 text-sm">{t?.footerTagline || 'Unleash your potential through the power of cold and breath'}</p>
        </div>
      </footer>
    </div>
  );
};

export default Layout;
