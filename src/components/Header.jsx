import React from 'react';
import { Link } from '@tanstack/react-router';
import { useApp } from '../contexts/AppContext';

const Header = () => {
  const { t, language, setLanguage, toggleMusic, isPlaying, mobileMenuOpen, setMobileMenuOpen, scrollToPackages, setShowAdmin } = useApp();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-md border-b border-cyan-400/10 animate-fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                <span className="text-cyan-400">❄️</span> {t.logo}
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <Link to="/" className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.home}</Link>
              <a href="#about" className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.about}</a>
              <button onClick={scrollToPackages} className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.packages}</button>
              <a href="#gallery" className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.gallery}</a>
              <a href="#contact" className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.contact}</a>
              <button 
                onClick={scrollToPackages}
                className="px-6 py-2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                {t.bookNow}
              </button>
              
              {/* Language Toggle */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 text-sm font-semibold text-white"
              >
                {language === 'en' ? '🇮🇱' : '🇺🇸'}
              </button>
              
              {/* Music Toggle */}
              <button 
                onClick={toggleMusic}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 hover:rotate-12 transition-all duration-300 text-lg"
              >
                {isPlaying ? '🔇' : '🔊'}
              </button>
            </nav>

            {/* Mobile Menu Button & Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Language Toggle Mobile */}
              <button 
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-xs"
              >
                {language === 'en' ? '🇮🇱' : '🇺🇸'}
              </button>
              
              {/* Music Toggle Mobile */}
              <button 
                onClick={toggleMusic}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-base"
              >
                {isPlaying ? '🔇' : '🔊'}
              </button>
              
              {/* Hamburger Button */}
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-cyan-400/10">
            <div className="px-4 py-6 space-y-4">
              <Link 
                to="/" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.home}
              </Link>
              <a 
                href="#about" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.about}
              </a>
              <button 
                onClick={() => { scrollToPackages(); setMobileMenuOpen(false); }}
                className="block w-full text-start px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.packages}
              </button>
              <a 
                href="#gallery" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.gallery}
              </a>
              <a 
                href="#contact" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.contact}
              </a>
              <button 
                onClick={() => { scrollToPackages(); setMobileMenuOpen(false); }}
                className="block w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-lg transition-all duration-300 text-center"
              >
                {t.bookNow}
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Admin Button */}
      <button 
        onClick={() => setShowAdmin(true)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 bg-cyan-500/20 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-3 rounded-full border border-cyan-400/30 hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 pointer-events-auto text-xs sm:text-sm font-semibold text-white"
      >
        🔐 {t.adminButton}
      </button>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden pointer-events-none">
        <button 
          onClick={scrollToPackages}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 pointer-events-auto"
        >
          📞 {t.bookNow}
        </button>
      </div>
    </>
  );
};

export default Header;
