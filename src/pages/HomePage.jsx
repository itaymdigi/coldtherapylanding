import { useState, useEffect, useRef } from 'react';
import OurInstructors from '../components/sections/OurInstructors';
import Gallery from '../components/sections/Gallery';
import StatsCounter from '../components/StatsCounter';
import VideoPlayer from '../components/VideoPlayer';
import { useApp } from '../contexts/AppContext';

const HomePage = () => {
  const homeId = 'home';
  const aboutId = 'about';
  const packagesId = 'packages';
  const contactId = 'contact';

  const {
    t,
    scrollToPackages,
    packagesRef,
    statsRef,
    statsSessions,
    statsSatisfaction,
    statsClients,
    statsTemp,
    danPhoto,
    heroVideo,
    scheduleImage,
    openFaq,
    setOpenFaq,
  } = useApp();

  const videoRef = useRef(null);
  const [shouldAutoplay, setShouldAutoplay] = useState(false);

  useEffect(() => {
    // Check if video has been played before
    const hasPlayedBefore = localStorage.getItem('heroVideoPlayed');
    if (!hasPlayedBefore) {
      setShouldAutoplay(true);
    }
  }, []);

  const handleVideoEnded = () => {
    // Mark video as played
    localStorage.setItem('heroVideoPlayed', 'true');
  };

  return (
    <>
      {/* Hero Section */}
      <div
        id={homeId}
        className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 pt-20"
      >
        <div className="text-center space-y-4 sm:space-y-6 w-full mt-12 sm:mt-20">
          {/* Hero Video - Full Width, Mobile Optimized */}
          {heroVideo && (
            <div className="mb-6 sm:mb-8 animate-fadeInUp w-full px-0 sm:px-4 md:px-8 lg:px-12">
              <video
                ref={videoRef}
                autoPlay={shouldAutoplay}
                muted
                playsInline
                controls
                onEnded={handleVideoEnded}
                className="w-full h-auto max-w-full object-cover rounded-lg sm:rounded-xl md:rounded-2xl shadow-2xl shadow-cyan-500/30 hover:scale-[1.02] transition-transform duration-500"
              >
                <source src={heroVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          )}

          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight px-2 animate-fadeInUp">
            {t?.heroTitle || 'Unleash Your'}
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-gradient">
              {t?.heroSubtitle || 'Ultimate Potential'}
            </span>
          </h1>

          <p
            className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto px-2 animate-fadeInUp"
            style={{ animationDelay: '0.2s' }}
          >
            {t?.heroDescription || 'Master the ancient art of cold therapy and breathwork. Supercharge your immune system, crush stress, and become unstoppable.'}
          </p>

          <div
            className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 justify-center pointer-events-auto px-4 animate-fadeInUp"
            style={{ animationDelay: '0.4s' }}
          >
            <button
              type="button"
              onClick={scrollToPackages}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 text-base sm:text-lg animate-glow relative overflow-hidden group"
            >
              <span className="relative z-10">{t?.viewPackages || 'Explore Packages'}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button
              type="button"
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-cyan-400/50 hover:bg-white/20 hover:border-cyan-400 hover:scale-110 transition-all duration-300 text-base sm:text-lg relative overflow-hidden group"
            >
              <span className="relative z-10">{t?.bookNow || 'Start Your Journey'}</span>
              <div className="absolute inset-0 animate-shimmer"></div>
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 sm:mt-24 md:mt-32 w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pointer-events-auto">
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                ❄️
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t?.benefitIceBath || 'Ice Bath Mastery'}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t?.benefitIceBathDesc || 'Plunge into transformation. Crush inflammation, accelerate recovery, and unlock razor-sharp mental clarity'}
              </p>
            </div>
            <div
              className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                🌬️
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t?.benefitBreathing || 'Power Breathing'}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t?.benefitBreathingDesc || 'Harness ancient breathwork techniques to obliterate stress, skyrocket your energy, and elevate your life'}
              </p>
            </div>
            <div
              className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer"
              style={{ transitionDelay: '0.2s' }}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                🧘
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t?.benefitGuided || 'Expert Guidance'}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t?.benefitGuidedDesc || 'Train with certified professionals who combine cold exposure and breathwork for maximum results and total safety'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Dan Hayat Section - MOVED UP for trust building */}
      <div
        id={aboutId}
        className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
            {/* Image/Avatar Side */}
            <div className="relative scroll-reveal group">
              <div className="aspect-square rounded-3xl overflow-hidden border-4 border-cyan-400/30 group-hover:border-cyan-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/30 bg-gradient-to-br from-slate-800 to-slate-900">
                <img
                  src={danPhoto}
                  alt="Dan Hayat - Cold Therapy Expert"
                  className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                />
              </div>
              {/* Decorative Elements */}
              <div className="absolute -top-6 -right-6 w-24 h-24 bg-cyan-400/20 rounded-full blur-2xl animate-float"></div>
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-blue-400/20 rounded-full blur-2xl animate-float-delayed"></div>
            </div>

            {/* Content Side */}
            <div className="space-y-6 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              <div>
                <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-3 sm:mb-4">
                  {t?.aboutTitle || 'Meet Dan Hayat'}
                </h2>
                <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mb-6"></div>
              </div>

              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">{t?.aboutP1 || 'My name is Dan Hayat...'}</p>

              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">{t?.aboutP2 || 'A little over two years ago...'}</p>

              {t?.aboutP3 && (
                <p className="text-base sm:text-lg text-blue-100 leading-relaxed">{t.aboutP3}</p>
              )}

              {t?.aboutP4 && (
                <p className="text-base sm:text-lg text-blue-100 leading-relaxed">{t.aboutP4}</p>
              )}

              <div className="space-y-4 pt-4">
                <div className="flex items-start gap-4">
                  <div className="text-3xl">🎓</div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{t?.aboutCert || 'Certified Expert'}</h4>
                    <p className="text-blue-200">{t?.aboutCertDesc || 'Wim Hof Method Instructor & Cryotherapy Specialist'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">💪</div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{t?.aboutExp || '10+ Years Experience'}</h4>
                    <p className="text-blue-200">{t?.aboutExpDesc || 'Helping clients achieve peak performance and wellness'}</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="text-3xl">❤️</div>
                  <div>
                    <h4 className="text-white font-semibold text-lg mb-1">{t?.aboutPassion || 'Passionate About Wellness'}</h4>
                    <p className="text-blue-200">{t?.aboutPassionDesc || 'Dedicated to transforming lives through cold therapy'}</p>
                  </div>
                </div>
              </div>

              <div className="pt-6">
                <blockquote className="border-l-4 border-cyan-400 pl-6 italic text-blue-100 text-lg">
                  {t?.aboutQuote || "Cold therapy isn't just about enduring the cold—it's about discovering your inner strength..."}
                </blockquote>
                <p className="text-cyan-400 font-semibold mt-3">— Dan Hayat</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section - MOVED DOWN after value is established */}
      <div
        id={packagesId}
        ref={packagesRef}
        className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4">
            {t?.packagesTitle || 'Choose Your Path'}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4">
            {t?.packagesSubtitle || 'Select the perfect plan to unlock your ultimate potential'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto pointer-events-auto">
            {/* Package 1: 10 Entries */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t?.package1Title || 'Starter Pack'}</h3>
                <div className="text-5xl font-bold text-cyan-400 mb-6">₪{t?.package1Price || '700'}</div>
                <ul className="text-left space-y-3 mb-8 text-blue-100 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t?.package1Feature1 || '10 powerful sessions - valid for 3 months'}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t?.package1Feature2 || 'Full access: Ice bath, sauna, hot/cold showers...'}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t?.package1Feature3 || 'Expert-led breathing & cold therapy workshops'}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  {t?.bookNow || 'Book Now'}
                </button>
              </div>
            </div>

            {/* Package 2: 6 Months - Most Popular */}
            <div className="bg-gradient-to-br from-cyan-800/50 to-blue-800/50 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-300/60 hover:border-cyan-300 hover:scale-105 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                {t?.package2Subtitle || 'Most Popular'}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t?.package2Title || '6-Month Elite Access'}</h3>
                <div className="text-5xl font-bold text-cyan-300 mb-2">₪{t?.package2Price || '1500'}</div>
                <div className="text-sm text-cyan-200 mb-6">{t?.package2PriceNote || 'Only 250 ₪/month'}</div>
                <ul className="text-left space-y-3 mb-8 text-blue-100 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-2 mt-1">•</span>
                    <span>{t.package2Feature1}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-2 mt-1">•</span>
                    <span>{t.package2Feature2}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-2 mt-1">•</span>
                    <span>{t.package2Feature3}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-2 mt-1">•</span>
                    <span>{t.package2Feature4}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-300 mr-2 mt-1">•</span>
                    <span>{t.package2Feature5}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  {t?.getStarted || 'Start Now'}
                </button>
              </div>
            </div>

            {/* Package 3: Monthly Pass */}
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 relative">
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-purple-500 to-pink-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                {t.package3Subtitle}
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{t.package3Title}</h3>
                <div className="text-5xl font-bold text-cyan-400 mb-2">₪{t.package3Price}</div>
                <div className="text-sm text-cyan-200 mb-6">{t.package3PriceNote}</div>
                <ul className="text-left space-y-3 mb-8 text-blue-100 text-sm">
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t.package3Feature1}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t.package3Feature2}</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-cyan-400 mr-2 mt-1">•</span>
                    <span>{t.package3Feature3}</span>
                  </li>
                </ul>
                <button
                  type="button"
                  className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  {t.bookNow}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Counter Section */}
      <div
        ref={statsRef}
        className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 scroll-reveal">
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">
                <StatsCounter target={statsSessions} suffix="+" />
              </div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">
                {t?.statsSessions || 'Sessions Completed'}
              </div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">
                <StatsCounter target={statsSatisfaction} suffix="%" />
              </div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">
                {t?.statsSatisfaction || 'Satisfaction Rate'}
              </div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">
                <StatsCounter target={statsClients} suffix="+" />
              </div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">
                {t?.statsClients || 'Happy Clients'}
              </div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">
                <StatsCounter target={statsTemp} suffix="°C" decimals={1} />
              </div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">
                {t?.statsTemp || 'Average Temp'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Ice Bath Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t?.whyIceBathTitle || 'Why Ice Bath Therapy?'}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4 scroll-reveal">
            {t?.whyIceBathSubtitle || 'Unlock the transformative power of cold water immersion'}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pointer-events-auto">
            <div className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">
                🧠
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t.whyBenefit1Title}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit1Desc}
              </p>
            </div>

            <div
              className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">
                💪
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t.whyBenefit2Title}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit2Desc}
              </p>
            </div>

            <div
              className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer"
              style={{ transitionDelay: '0.2s' }}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">
                ⚡
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t.whyBenefit3Title}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit3Desc}
              </p>
            </div>

            <div
              className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer"
              style={{ transitionDelay: '0.3s' }}
            >
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">
                🎯
              </div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">
                {t.whyBenefit4Title}
              </h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit4Desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Video Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4">
            {t?.videoTitle || 'Witness The Transformation'}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4">
            {t?.videoSubtitle || 'See real people unlock their potential through cold therapy'}
          </p>

          <div className="relative rounded-3xl overflow-hidden border-4 border-cyan-400/30 mb-8 group scroll-reveal hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500">
            <div className="aspect-video">
              <VideoPlayer
                videoId="1uerS5JjjRI"
                title="Cold Therapy - Main Video"
                className="w-full h-full"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/30 group hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 scroll-reveal">
              <div className="aspect-video">
                <VideoPlayer
                  videoId="bdWnPq7MuWE"
                  title="Cold Therapy Session"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div
              className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/30 group cursor-pointer hover:border-cyan-400/60 transition-all duration-300 scroll-reveal"
              style={{ transitionDelay: '0.1s' }}
            >
              <div className="aspect-video bg-gradient-to-br from-cyan-900/40 to-purple-900/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                    🎥
                  </div>
                  <div className="text-white font-semibold">{t.videoComingSoon}</div>
                  <div className="text-blue-200 text-sm mt-1">{t.videoStayTuned}</div>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-200 mb-4">{t.videoCTA}</p>
            <button
              type="button"
              className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg"
            >
              {t.videoButton}
            </button>
          </div>
        </div>
      </div>

      {/* Gallery Section */}
      <Gallery />

      {/* Event Schedule Section */}
      {scheduleImage && (
        <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
              {t.scheduleTitle}
            </h2>
            <p
              className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal"
              style={{ transitionDelay: '0.1s' }}
            >
              {t.scheduleSubtitle}
            </p>
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-500">
              <img src={scheduleImage} alt="Event Schedule" className="w-full rounded-2xl" />
            </div>
          </div>
        </div>
      )}

      {/* Our Instructors Section */}
      <OurInstructors />

      {/* FAQ Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t?.faqTitle || 'Frequently Asked Questions'}
          </h2>
          <p
            className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal"
            style={{ transitionDelay: '0.1s' }}
          >
            {t?.faqSubtitle || 'Everything you need to know about cold therapy'}
          </p>

          <div className="space-y-4 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            {[1, 2, 3, 4, 5].map((faqNum) => (
              <div
                key={faqNum}
                className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setOpenFaq(openFaq === faqNum ? null : faqNum)}
                  className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
                >
                  <span className="text-white font-semibold text-lg">{t?.[`faq${faqNum}Q`] || `Question ${faqNum}`}</span>
                  <span className="text-cyan-400 text-2xl">{openFaq === faqNum ? '−' : '+'}</span>
                </button>
                {openFaq === faqNum && (
                  <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                    {t?.[`faq${faqNum}A`] || `Answer ${faqNum}`}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Clients Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t?.ourClientsTitle || 'Our Clients'}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal">
            {t?.ourClientsSubtitle || 'Trusted by leading organizations'}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 scroll-reveal">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-white text-sm font-semibold">{t?.clientEnterprise || 'Enterprise'}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏋️</div>
                <p className="text-white text-sm font-semibold">{t?.clientFitness || 'Fitness Centers'}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">⚽</div>
                <p className="text-white text-sm font-semibold">{t?.clientSports || 'Sports Teams'}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏥</div>
                <p className="text-white text-sm font-semibold">{t?.clientWellness || 'Wellness Centers'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div
        id={contactId}
        className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24"
      >
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12 px-4 scroll-reveal">
            {t?.contactTitle || 'Contact Us'}
          </h2>

          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 scroll-reveal">
            <a
              href={`tel:${t?.contactPhone || '+972-052-434-3975'}`}
              className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 group pointer-events-auto"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📞
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t?.contactPhoneLabel || 'Phone'}</h3>
                <p className="text-cyan-300 text-lg" dir="ltr">
                  {t?.contactPhone || '+972-052-434-3975'}
                </p>
              </div>
            </a>

            <a
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t?.contactAddress || 'Ben Yehuda 30, Herzliya, Israel')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 group pointer-events-auto"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                  📍
                </div>
                <h3 className="text-white font-bold text-xl mb-2">{t?.contactLocationLabel || 'Location'}</h3>
                <p className="text-cyan-300 text-lg">{t?.contactAddress || 'Ben Yehuda 30, Herzliya, Israel'}</p>
              </div>
            </a>
          </div>

        </div>
      </div>
    </>
  );
};

export default HomePage;
