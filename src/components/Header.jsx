import { Link } from '@tanstack/react-router';
import { useApp } from '../contexts/AppContext';

const Header = () => {
  const {
    t,
    language,
    setLanguage,
    toggleMusic,
    isPlaying,
    mobileMenuOpen,
    setMobileMenuOpen,
    scrollToPackages,
    setShowAdmin,
  } = useApp();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-md border-b border-cyan-400/10 animate-fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <Link to="/" className="flex-shrink-0 group">
              <div className="flex flex-col">
                <div className="text-base sm:text-lg md:text-xl font-bold tracking-wider">
                  <span className="text-white">C</span>
                  <span className="text-cyan-400 mx-0.5">❄️</span>
                  <span className="text-white">LD THERAPY</span>
                </div>
                <div className="text-[10px] sm:text-xs tracking-widest text-white/70 group-hover:text-white/90 transition-colors">
                  {t?.logoSubtitle || 'BY DAN HAYAT'}
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 rtl:gap-reverse">
              <Link
                to="/"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.home || 'Home'}
              </Link>
              <Link
                to="/breathing-videos"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.breathingVideosMenu || 'Breathwork Videos'}
              </Link>
              <Link
                to="/instructor-training"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.instructorTraining || 'Instructor Training'}
              </Link>
              <Link
                to="/#about"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.about || 'About'}
              </Link>
              <Link
                to="/live-practice"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.livePractice || 'Live Training'}
              </Link>
              <Link
                to="/event-schedule"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.eventScheduleMenu || 'Event Schedule'}
              </Link>
              <Link
                to="/#packages"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.packages || 'Packages'}
              </Link>
              <Link
                to="/#instructors"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.instructors || 'Our Instructors'}
              </Link>
              <Link
                to="/#gallery"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.gallery || 'Gallery'}
              </Link>
              <Link
                to="/#contact"
                className="text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300 font-medium text-base px-4 py-2 rounded-lg"
              >
                {t?.contact || 'Contact'}
              </Link>

              {/* Language Toggle */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 transition-all duration-300 text-base font-semibold text-white"
              >
                {language === 'en' ? '🇮🇱' : '🇺🇸'}
              </button>

              {/* Music Toggle */}
              <button
                type="button"
                onClick={toggleMusic}
                className="px-3 py-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 hover:rotate-12 transition-all duration-300 text-base"
              >
                {isPlaying ? '🔇' : '🎵'}
              </button>

              {/* Admin Button */}
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="px-3 py-2 bg-cyan-500/20 backdrop-blur-md rounded-lg border border-cyan-400/30 hover:bg-cyan-500/30 hover:scale-105 transition-all duration-300 text-base"
                title={t?.adminButton || 'Admin'}
              >
                🔐
              </button>
            </nav>

            {/* Mobile Menu Button & Controls */}
            <div className="md:hidden flex items-center gap-2">
              {/* Language Toggle Mobile */}
              <button
                type="button"
                onClick={() => setLanguage(language === 'en' ? 'he' : 'en')}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
              >
                {language === 'en' ? '🇮🇱' : '🇺🇸'}
              </button>

              {/* Music Toggle Mobile */}
              <button
                type="button"
                onClick={toggleMusic}
                className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20 hover:bg-white/20 hover:scale-105 hover:rotate-12 transition-all duration-300 text-base"
              >
                {isPlaying ? '🔇' : '🔊'}
              </button>

              {/* Admin Button Mobile */}
              <button
                type="button"
                onClick={() => setShowAdmin(true)}
                className="p-2 bg-cyan-500/20 backdrop-blur-md rounded-lg border border-cyan-400/30 hover:bg-cyan-500/30 transition-all duration-300 text-base"
                title={t.adminButton}
              >
                🔐
              </button>

              {/* Hamburger Button */}
              <button
                type="button"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-lg text-cyan-400 hover:bg-cyan-400/10 transition-all duration-300"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Close menu</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                ) : (
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <title>Open menu</title>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/98 backdrop-blur-lg border-t border-cyan-400/10">
            <div className="px-4 py-6 space-y-3">
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.home || 'Home'}
              </Link>
              <Link
                to="/breathing-videos"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                🌬️ {t?.breathingVideosMenu || 'Breathwork Videos'}
              </Link>
              <Link
                to="/instructor-training"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                🎓 {t?.instructorTraining || 'Instructor Training'}
              </Link>
              <Link
                to="/#about"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.about || 'About'}
              </Link>
              <Link
                to="/live-practice"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                ⏱️ {t?.livePractice || 'Live Training'}
              </Link>
              <Link
                to="/event-schedule"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                📅 {t?.eventScheduleMenu || 'Event Schedule'}
              </Link>
              <Link
                to="/#packages"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.packages || 'Packages'}
              </Link>
              <Link
                to="/#instructors"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.instructors || 'Our Instructors'}
              </Link>
              <Link
                to="/#gallery"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.gallery || 'Gallery'}
              </Link>
              <Link
                to="/#contact"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium text-lg"
              >
                {t?.contact || 'Contact'}
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden pointer-events-none">
        <button
          type="button"
          onClick={scrollToPackages}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 pointer-events-auto"
        >
          📞 {t?.bookNow || 'Book Now'}
        </button>
      </div>
    </>
  );
};

export default Header;
