import React from 'react';
import { useApp } from '../../contexts/AppContext';

const AboutSection = () => {
  const { t, danPhoto } = useApp();

  return (
    <div id="about" className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
      <div className="max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8 sm:gap-12 items-center">
          {/* Image/Avatar Side */}
          <div className="relative scroll-reveal group">
            <div className="aspect-square rounded-3xl overflow-hidden border-4 border-cyan-400/30 group-hover:border-cyan-400 transition-all duration-500 shadow-2xl hover:shadow-cyan-500/30 bg-gradient-to-br from-slate-800 to-slate-900">
              <img 
                src={danPhoto} 
                alt="Dan Hayat - Cold Therapy Expert" 
                className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 group-hover:scale-110"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.parentElement.innerHTML = `
                    <div class="w-full h-full flex items-center justify-center relative">
                      <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-600/10"></div>
                      <div class="relative z-10 text-center p-8">
                        <div class="text-8xl mb-4 filter drop-shadow-2xl">👨‍⚕️</div>
                        <div class="text-white text-2xl font-bold mb-2">Dan Hayat</div>
                        <div class="text-cyan-400 text-lg">Cold Therapy Expert</div>
                      </div>
                    </div>
                  `;
                }}
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
                {t.aboutTitle}
              </h2>
              <div className="w-20 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mb-6"></div>
            </div>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              {t.aboutP1}
            </p>

            <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
              {t.aboutP2}
            </p>

            {t.aboutP3 && (
              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                {t.aboutP3}
              </p>
            )}

            {t.aboutP4 && (
              <p className="text-base sm:text-lg text-blue-100 leading-relaxed">
                {t.aboutP4}
              </p>
            )}

            <div className="space-y-4 pt-4">
              <div className="flex items-start gap-4">
                <div className="text-3xl">🎓</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">{t.aboutCert}</h4>
                  <p className="text-blue-200">{t.aboutCertDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">💪</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">{t.aboutExp}</h4>
                  <p className="text-blue-200">{t.aboutExpDesc}</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">❤️</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-1">{t.aboutPassion}</h4>
                  <p className="text-blue-200">{t.aboutPassionDesc}</p>
                </div>
              </div>
            </div>

            <div className="pt-6">
              <blockquote className="border-l-4 border-cyan-400 pl-6 italic text-blue-100 text-lg">
                {t.aboutQuote}
              </blockquote>
              <p className="text-cyan-400 font-semibold mt-3">— Dan Hayat</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutSection;
