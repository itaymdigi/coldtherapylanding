import React from 'react';
import { useApp } from '../contexts/AppContext';

const InstructorTrainingPage = () => {
  const { t } = useApp();

  return (
    <div className="min-h-screen pt-24 pb-12">
      {/* Hero Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-6 scroll-reveal">
            {t.instructorTitle}
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-cyan-400 to-blue-600 mx-auto mb-8"></div>
        </div>
      </div>

      {/* Main Content */}
      <div className="relative z-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-lg p-8 sm:p-12 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-500 scroll-reveal">
            <div className="space-y-6 text-blue-100 leading-relaxed text-base sm:text-lg">
              <p className="text-cyan-200 font-semibold text-lg sm:text-xl">
                {t.instructorP1}
              </p>
              <p>{t.instructorP2}</p>
              <p className="text-cyan-300 font-semibold">{t.instructorP3}</p>
              <p>{t.instructorP4}</p>
              <p>{t.instructorP5}</p>
              <p>{t.instructorP6}</p>
              <p>{t.instructorP7}</p>
              <p className="text-cyan-300 font-bold text-xl sm:text-2xl text-center">
                {t.instructorP8}
              </p>
              <p className="text-white font-semibold text-lg sm:text-xl">
                {t.instructorP9}
              </p>
              <p>{t.instructorP10}</p>
              <p className="text-cyan-200 font-semibold text-lg">
                {t.instructorP11}
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="mt-12 flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/972524343975"
                target="_blank"
                rel="noopener noreferrer"
                className="px-10 py-5 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 text-center"
              >
                📱 WhatsApp - הצטרף עכשיו
              </a>
              <a
                href="tel:+972524343975"
                className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 text-center"
              >
                📞 התקשר עכשיו
              </a>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="mt-16 grid md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-500 scroll-reveal">
              <div className="text-5xl mb-4">🎓</div>
              <h3 className="text-white font-bold text-xl mb-3">הכשרה מקצועית</h3>
              <p className="text-blue-200">
                למד את כל הטכניקות והפרוטוקולים המוכחים לניהול סדנאות טיפול בקור ונשימה
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-500 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-white font-bold text-xl mb-3">בניית קריירה</h3>
              <p className="text-blue-200">
                קבל כלים לבניית עסק מצליח בתחום הבריאות הטבעית והוולנס
              </p>
            </div>

            <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-500 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
              <div className="text-5xl mb-4">🌟</div>
              <h3 className="text-white font-bold text-xl mb-3">קהילה תומכת</h3>
              <p className="text-blue-200">
                הצטרף לקהילה של מדריכים מוסמכים ובנה רשת מקצועית חזקה
              </p>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="mt-16 bg-gradient-to-br from-cyan-900/20 to-blue-900/20 backdrop-blur-md p-8 sm:p-12 rounded-3xl border border-cyan-400/30 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-8 text-center">
              מה תלמד בהכשרה?
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start gap-4">
                <div className="text-3xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">טכניקות נשימה מתקדמות</h4>
                  <p className="text-blue-200">פראניאמה, נשימה מעגלית, ושיטות נשימה ייחודיות</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">פרוטוקולי טיפול בקור</h4>
                  <p className="text-blue-200">שילוב מבוקר של חשיפה לקור וחום</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">ניהול מרחבים מרפאים</h4>
                  <p className="text-blue-200">כיצד להחזיק סדנאות בטוחות ומשנות חיים</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="text-3xl">✓</div>
                <div>
                  <h4 className="text-white font-semibold text-lg mb-2">בניית עסק מצליח</h4>
                  <p className="text-blue-200">שיווק, תמחור, ובניית זהות מקצועית</p>
                </div>
              </div>
            </div>
          </div>

          {/* Final CTA */}
          <div className="mt-16 text-center bg-gradient-to-r from-cyan-500/10 to-blue-600/10 backdrop-blur-md p-12 rounded-3xl border-2 border-cyan-400/30 scroll-reveal">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              מוכן להצטרף למהפכה?
            </h2>
            <p className="text-xl text-blue-200 mb-8 max-w-2xl mx-auto">
              הזמן המדויק ביותר להיכנס לתחום. הביקוש רק הולך לעלות.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="https://wa.me/972524343975"
                target="_blank"
                rel="noopener noreferrer"
                className="px-12 py-6 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold text-xl rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300"
              >
                📱 WhatsApp
              </a>
              <a
                href="/#contact"
                className="px-12 py-6 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-xl rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300"
              >
                📞 צור קשר
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorTrainingPage;
