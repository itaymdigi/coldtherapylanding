import { query } from './_generated/server';

// Get chatbot knowledge base (FAQ, packages, benefits)
export const getKnowledge = query({
  handler: async () => {
    return {
      business: {
        name: 'Cold Therapy Academy - Dan Hayat',
        description: 'מרכז מקצועי לטיפול בקור, אמבטיות קרח וסדנאות חווייתיות בהרצליה, ישראל',
        location: 'בן יהודה 30, הרצליה, ישראל',
        phone: '052-434-3975',
        website: 'https://www.danhayat.co.il/',
        instructor: 'Dan Hayat - מדריך מוסמך בשיטת Wim Hof',
      },
      services: [
        {
          type: 'personal-session',
          name: 'פגישה אישית - Personal Session',
          price: '₪500',
          description:
            'סדנה אישית שבמהלכה נעבוד על איפוס טוטאלי של המערכות החיוניות בגוף. מדובר בסדנה מאוד חווייתית שהמטרות המרכזיות שלה הן לתת שוק למערכת העצבים על מנת להוציא את כל הסטרס מהגוף, לעורר את מערכת החיסון ולאמן את מערכת הדם.',
          includes: [
            'תרגול נשימות ייחודי - Unique breathing exercises',
            'טבילה במי קרח 0-3 מעלות - Ice bath immersion at 0-3°C',
            'הדרכה אישית מדן - Personal guidance from Dan',
            'שבירת גבולות וחסמים - Breaking boundaries and barriers',
            'חוויה של אופוריה וחיבור עצמי - Experience of euphoria and self-connection',
          ],
          duration: '60-90 דקות',
        },
        {
          type: 'couples-session',
          name: 'סדנה זוגית - Couples Session',
          price: '₪650',
          description:
            'סדנה זוגית חווייתית שבמהלכה נעבוד על איפוס טוטאלי של המערכות החיוניות בגוף. חוויה משותפת של שבירת גבולות, חיזוק מערכת החיסון ואימון מערכת הדם.',
          includes: [
            'תרגול נשימות ייחודי לזוג - Unique breathing exercises for couples',
            'טבילה במי קרח 0-3 מעלות - Ice bath immersion at 0-3°C',
            'חוויה משותפת של שבירת גבולות - Shared experience of breaking boundaries',
            'תחושות אופוריה וזרמים בגוף - Feelings of euphoria and energy flow',
            'כיף גדול! - Great fun!',
          ],
          duration: '60-90 דקות',
        },
        {
          type: 'experiential-workshop',
          name: 'סדנה חווייתית - Experiential Workshop',
          description: 'סדנה קבוצתית חווייתית המשלבת תרגולי נשימה, יוגה, תנועה ואמבטיית קרח',
          includes: [
            'תרגולי נשימה קבוצתיים - Group breathing exercises',
            'יוגה ותנועה - Yoga and movement',
            'אמבטיית קרח קבוצתית - Group ice bath',
            'חוויה קהילתית - Community experience',
          ],
        },
        {
          type: 'corporate-workshops',
          name: 'סדנאות לחברות וארגונים - Corporate Workshops',
          description:
            'סדנאות מותאמות אישית לחברות וארגונים לחיזוק הצוות, שיפור ביצועים והתמודדות עם סטרס',
          benefits: [
            'חיזוק עבודת צוות - Team building',
            'שיפור ביצועים - Performance improvement',
            'התמודדות עם סטרס ארגוני - Organizational stress management',
            'חוויה ייחודית לעובדים - Unique employee experience',
          ],
        },
        {
          type: 'instructor-training',
          name: 'הכשרת מדריכים - Instructor Training',
          description: 'קורס מקצועי להכשרת מדריכי אמבטיות קרח ושיטת Wim Hof',
          includes: [
            'הכשרה מקצועית מלאה - Full professional training',
            'תעודה מוכרת - Recognized certification',
            'ליווי אישי - Personal mentorship',
            'כלים להדרכת אחרים - Tools for teaching others',
          ],
        },
      ],
      packages: [
        {
          type: '10-entries',
          name: 'כרטיסיה - 10 כניסות - 10 Entry Card',
          description: '10 כניסות לבחירתכם מבין הפעילויות שלנו',
          includes: [
            'תרגולי נשימה - Breathing exercises',
            'יוגה - Yoga',
            'תנועה - Movement',
            'סאונד-הילינג - Sound healing',
            'מדיטציה - Meditation',
            'חדר כושר - Gym',
            'הרצאות וערבי קונספט - Lectures and concept evenings',
            'שימוש חופשי באמבטיות הקרח - Free use of ice baths',
            'שימוש בסאונה - Sauna access',
          ],
          validity: 'תקף למשך תקופה מוגדרת',
        },
        {
          type: 'monthly',
          name: 'מנוי חופשי-חודשי - Monthly Unlimited Pass',
          description: 'גישה חופשית לכל השיעורים ושימוש חופשי במתקנים',
          includes: [
            'גישה חופשית לכל השיעורים - Unlimited access to all classes',
            'תרגולי נשימה, יוגה, תנועה - Breathing, yoga, movement',
            'סאונד-הילינג, מדיטציה - Sound healing, meditation',
            'חדר כושר - Gym access',
            'הרצאות וערבי קונספט - Lectures and concept evenings',
            'שימוש חופשי באמבטיות הקרח - Unlimited ice bath access',
            "שימוש בג'אקוזי - Jacuzzi access",
            'שימוש בסאונות - Sauna access',
          ],
          benefits: [
            'גמישות חודשית - Monthly flexibility',
            'אין התחייבות ארוכת טווח - No long-term commitment',
          ],
        },
        {
          type: '6-months',
          name: 'מנוי חופשי-חודשי 6 חודשים - 6-Month Unlimited Pass',
          description: 'מנוי מקיף ל-6 חודשים עם יתרונות נוספים',
          includes: [
            'גישה חופשית לכל השיעורים - Unlimited access to all classes',
            'שימוש חופשי במתקנים - Free use of all facilities',
            'תרגולי נשימה, יוגה, תנועה, סאונד-הילינג, מדיטציה - All activities',
            'חדר כושר - Gym access',
            'הרצאות וערבי קונספט - Lectures and events',
            'שימוש חופשי באמבטיות הקרח - Unlimited ice baths',
            "שימוש בג'אקוזי והסאונות - Jacuzzi and saunas",
          ],
          bonuses: [
            'בניית תוכנית אימונים אישית - Personal training program',
            'מתנת הצטרפות - Welcome gift',
          ],
          benefits: [
            'חיסכון משמעותי - Significant savings',
            'מחויבות לתהליך - Commitment to the process',
          ],
        },
      ],
      benefits: [
        {
          title: 'התמודדות עם סטרס - Stress Management',
          description:
            'התמודדות יעילה עם סטרס ואימון מערכת העצבים להוציא אותו החוצה ע"י טבילה במי קרח',
          icon: '🧘',
        },
        {
          title: 'חיזוק המערכת החיסונית - Immune System Boost',
          description: 'חיזוק המערכת החיסונית, מערכת הדם תוך הורדת עומס מהלב והגברת עמידות לקור',
          icon: '💪',
        },
        {
          title: 'התאוששות מהירה - Fast Recovery',
          description:
            'התאוששות מהירה מפציעות, האצת תהליכים אנטי דלקטיים והגברת ייצור דופמין (פי 250% מהנורמה!)',
          icon: '⚡',
        },
        {
          title: 'שיפור המצב המנטאלי - Mental Improvement',
          description: 'שיפור המצב המנטאלי וחיזוק תחושת מסוגלות תוך שיפור ביכולת קבלת החלטות בחיים',
          icon: '🧠',
        },
        {
          title: 'הפחתת דלקות - Inflammation Reduction',
          description: 'הפחתת דלקות בגוף והאצת תהליכי ריפוי טבעיים',
          icon: '🔥',
        },
        {
          title: 'שיפור בהירות מחשבתית - Mental Clarity',
          description: 'חדות מחשבתית משופרת וריכוז מוגבר',
          icon: '💡',
        },
        {
          title: 'עלייה ברמות האנרגיה - Energy Boost',
          description: 'אנרגיה מתמשכת לאורך כל היום',
          icon: '⚡',
        },
        {
          title: 'שיפור איכות השינה - Better Sleep',
          description: 'שינה עמוקה ומשקמת יותר',
          icon: '😴',
        },
      ],
      faq: [
        {
          question: 'What should I bring to my first session? - מה להביא לפגישה הראשונה?',
          answer:
            "Just bring a towel, warm clothes for after, and your courage! We'll provide everything else you need. - הביאו מגבת, בגדים חמים לאחר מכן, ואומץ! אנחנו מספקים את כל השאר.",
        },
        {
          question: 'How cold is the ice bath? - כמה קר המים?',
          answer:
            'Our ice baths are maintained at 0-3°C (32-37°F) - the optimal temperature for maximum benefits and transformation. - אמבטיות הקרח שלנו בטמפרטורה של 0-3 מעלות צלזיוס - הטמפרטורה האופטימלית לתוצאות מקסימליות.',
        },
        {
          question: "I'm a complete beginner - is this safe for me? - האם זה בטוח למתחילים?",
          answer:
            "Absolutely! Dan personally guides every session and ensures your safety. We'll start easy and build your resilience step by step. - בהחלט! דן מדריך אישית כל פגישה ומבטיח את בטחונך. נתחיל בקלות ונבנה את החוסן שלך צעד אחר צעד.",
        },
        {
          question: 'How long is each session? - כמה זמן נמשכות הפגישות?',
          answer:
            'Each transformative session lasts 60-90 minutes, including powerful breathing exercises, theory, and the ice bath experience. - כל פגישה משנת חיים נמשכת 60-90 דקות, כולל תרגילי נשימה עוצמתיים, תיאוריה וחוויית אמבט הקרח.',
        },
        {
          question: 'What happens during a session? - מה קורה במהלך הפגישה?',
          answer:
            "We start with theory about cold therapy principles, then practice unique breathing techniques, and finally experience the ice bath immersion. You'll feel euphoria, energy flow throughout your body, and deep self-connection. - נתחיל בתיאוריה על עקרונות הטיפול בקור, נתרגל טכניקות נשימה ייחודיות, ולבסוף נחווה את הטבילה באמבט הקרח. תחוו אופוריה, זרמי אנרגיה בכל הגוף וחיבור עצמי עמוק.",
        },
        {
          question: 'Where are you located? - איפה אתם נמצאים?',
          answer:
            "We're located at Ben Yehuda 30, Herzliya, Israel. Easy to reach and plenty of parking available. - אנחנו נמצאים ברחוב בן יהודה 30, הרצליה, ישראל. קל להגיע ויש הרבה חניות.",
        },
        {
          question: 'Do you offer corporate workshops? - האם אתם מציעים סדנאות לחברות?',
          answer:
            'Yes! We offer customized corporate workshops for team building, performance improvement, and stress management. Contact us for details. - כן! אנחנו מציעים סדנאות מותאמות אישית לחברות לחיזוק צוות, שיפור ביצועים והתמודדות עם סטרס. צרו קשר לפרטים.',
        },
        {
          question: 'Can I become a certified instructor? - האם אני יכול להיות מדריך מוסמך?',
          answer:
            "Yes! We offer professional instructor training courses. You'll receive recognized certification and personal mentorship from Dan. - כן! אנחנו מציעים קורסים מקצועיים להכשרת מדריכים. תקבלו תעודה מוכרת וליווי אישי מדן.",
        },
        {
          question: "What's included in the membership packages? - מה כלול במנויים?",
          answer:
            "Our memberships include unlimited access to all classes (breathing, yoga, movement, sound healing, meditation), gym access, ice baths, jacuzzi, and saunas. The 6-month package also includes a personal training program and welcome gift. - המנויים שלנו כוללים גישה חופשית לכל השיעורים (נשימה, יוגה, תנועה, סאונד-הילינג, מדיטציה), חדר כושר, אמבטיות קרח, ג'אקוזי וסאונות. מנוי 6 חודשים כולל גם תוכנית אימונים אישית ומתנת הצטרפות.",
        },
      ],
      breathingTechniques: [
        {
          name: 'Wim Hof Method - שיטת ווים הוף',
          description:
            'The signature breathing technique combining controlled hyperventilation with breath retention',
        },
        {
          name: 'Box Breathing - נשימת קופסה',
          description: 'Equal-length inhale, hold, exhale, hold pattern for stress reduction',
        },
        {
          name: '4-7-8 Technique - נשימת 4-7-8',
          description: 'Inhale for 4, hold for 7, exhale for 8 - promotes relaxation and sleep',
        },
        {
          name: 'Holotropic Breathwork - נשימה הולוטרופית',
          description:
            'Deep, rapid breathing for altered states of consciousness and emotional release',
        },
      ],
      facilities: [
        'אמבטיות קרח מקצועיות - Professional ice baths',
        "ג'אקוזי - Jacuzzi",
        'סאונות - Saunas',
        'חדר כושר - Gym',
        'אולם יוגה ותנועה - Yoga and movement studio',
        'חלל למדיטציה - Meditation space',
      ],
      contact: {
        phone: '052-434-3975',
        whatsapp: '052-434-3975',
        address: 'בן יהודה 30, הרצליה, ישראל',
        website: 'https://www.danhayat.co.il/',
      },
    };
  },
});
