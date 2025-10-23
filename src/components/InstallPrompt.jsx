import { Download, X } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import { useApp } from '../contexts/AppContext';

const InstallPrompt = () => {
  const { language } = useApp();
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  const translations = {
    he: {
      title: 'התקן את האפליקציה',
      description: 'התקן את Cold Therapy במכשיר שלך לגישה מהירה וחוויה טובה יותר',
      install: 'התקן עכשיו',
      later: 'אולי מאוחר יותר',
      installed: 'האפליקציה מותקנת ✓',
    },
    en: {
      title: 'Install App',
      description: 'Install Cold Therapy on your device for quick access and better experience',
      install: 'Install Now',
      later: 'Maybe Later',
      installed: 'App Installed ✓',
    },
  };

  const t = translations[language];

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Show prompt after 3 seconds
      setTimeout(() => {
        const dismissed = localStorage.getItem('pwa-install-dismissed');
        if (!dismissed) {
          setShowPrompt(true);
        }
      }, 3000);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('✅ PWA installed successfully');
      setIsInstalled(true);
      setShowPrompt(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    // Show install prompt
    deferredPrompt.prompt();

    // Wait for user choice
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to install prompt: ${outcome}`);

    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    } else {
      console.log('User dismissed the install prompt');
    }

    // Clear the deferred prompt
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    localStorage.setItem('pwa-install-dismissed', 'true');

    // Show again after 7 days
    setTimeout(
      () => {
        localStorage.removeItem('pwa-install-dismissed');
      },
      7 * 24 * 60 * 60 * 1000
    );
  };

  // Don't show if already installed or no prompt available
  if (isInstalled || !showPrompt || !deferredPrompt) {
    return null;
  }

  return (
    <div className="fixed bottom-20 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 animate-slide-up">
      <div className="bg-gradient-to-br from-cyan-900 to-blue-900 rounded-2xl shadow-2xl border border-cyan-400/30 backdrop-blur-lg overflow-hidden">
        {/* Close button */}
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 text-cyan-300 hover:text-white transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>

        {/* Content */}
        <div className="p-6">
          <div className="flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl flex items-center justify-center">
              <Download className="text-white" size={24} />
            </div>

            {/* Text */}
            <div className="flex-1">
              <h3 className="text-lg font-bold text-white mb-1">{t.title}</h3>
              <p className="text-sm text-cyan-200 mb-4">{t.description}</p>

              {/* Buttons */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={handleInstallClick}
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2.5 rounded-lg font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all transform hover:scale-105 shadow-lg"
                >
                  {t.install}
                </button>
                <button
                  type="button"
                  onClick={handleDismiss}
                  className="px-4 py-2.5 rounded-lg font-semibold text-cyan-300 hover:text-white hover:bg-white/10 transition-all"
                >
                  {t.later}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500"></div>
      </div>
    </div>
  );
};

export default InstallPrompt;
