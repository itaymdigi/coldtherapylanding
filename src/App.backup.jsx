import React, { useState, useRef, useEffect } from 'react';

function App() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPackages, setShowPackages] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [language, setLanguage] = useState('he'); // 'en' or 'he' - Default to Hebrew
  const [scheduleImage, setScheduleImage] = useState(null);
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [adminSection, setAdminSection] = useState('schedule');
  const [galleryImages, setGalleryImages] = useState([
    '/gallery1.jpg', '/gallery2.jpg', '/gallery3.jpg', '/gallery4.jpg',
    '/gallery5.jpg', '/gallery6.jpg', '/gallery7.jpg'
  ]);
  const [danPhoto, setDanPhoto] = useState('/20250906_123005.jpg');
  const [statsAnimated, setStatsAnimated] = useState(false);
  const [statsSessions, setStatsSessions] = useState(0);
  const [statsSatisfaction, setStatsSatisfaction] = useState(0);
  const [statsClients, setStatsClients] = useState(0);
  const [statsTemp, setStatsTemp] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const audioRef = useRef(null);
  const packagesRef = useRef(null);
  const statsRef = useRef(null);

  const translations = {
    en: {
      logo: 'COLD THERAPY',
      logoSubtitle: 'BY DAN HAYAT',
      menu: 'Menu',
      home: 'Home',
      about: 'About',
      packages: 'Packages',
      gallery: 'Gallery',
      contact: 'Contact',
      heroTitle: 'Transform Your',
      heroSubtitle: 'Mind & Body',
      heroDescription: 'Experience the power of cold therapy and breathwork. Boost your immune system, reduce stress, and unlock your full potential.',
      viewPackages: 'View Packages',
      bookNow: 'Book Now',
      benefitIceBath: 'Ice Bath Therapy',
      benefitIceBathDesc: 'Immerse yourself in cold water therapy to reduce inflammation, boost recovery, and enhance mental clarity',
      benefitBreathing: 'Breathing Techniques',
      benefitBreathingDesc: 'Master powerful breathwork methods to reduce stress, increase energy, and improve overall well-being',
      benefitGuided: 'Guided Sessions',
      benefitGuidedDesc: 'Expert-led sessions combining cold exposure and breathwork for maximum benefits and safety',
      packagesTitle: 'Choose Your Package',
      packagesSubtitle: 'Select the perfect plan for your wellness journey',
      package1Title: '10 Entries',
      package1Price: '700',
      package1Feature1: '10 entries valid for 3 months from purchase date',
      package1Feature2: 'Includes: entry, towel, sauna, hot/cold showers, massage chair, herbal tea, and more',
      package1Feature3: 'Breathing and cold therapy workshops in the ice pool',
      package2Title: 'Monthly Pass - 6 Months',
      package2Subtitle: 'Most Popular',
      package2Price: '1500',
      package2PriceNote: '250 ₪/month',
      package2Feature1: 'Unlimited entries for all activities',
      package2Feature2: 'Cold therapy workshops in the ice pool',
      package2Feature3: 'Includes: entry, towel, sauna, hot/cold showers, massage chair, herbal tea, and more. Also includes cold therapy workshops in the ice pool and personal training sessions',
      package2Feature4: 'Personal training sessions',
      package2Feature5: 'Ice pool rental',
      package3Title: 'Monthly Pass',
      package3Subtitle: 'Best Value',
      package3Price: '300',
      package3PriceNote: 'per month',
      package3Feature1: 'Unlimited entries for all activities',
      package3Feature2: 'Cold therapy workshops in the ice pool',
      package3Feature3: 'Includes: entry, towel, sauna, hot/cold showers, massage chair, herbal tea, and more. Also includes cold therapy workshops in the ice pool and personal training sessions',
      popular: 'POPULAR',
      mostPopular: 'Most Popular',
      bestValue: 'Best Value',
      save: 'Save',
      getStarted: 'Get Started',
      bestValue: 'Best Value',
      statsSessions: 'Sessions Completed',
      statsSatisfaction: 'Satisfaction Rate',
      statsClients: 'Happy Clients',
      statsTemp: 'Average Temp',
      aboutTitle: 'Meet Dan Hayat',
      aboutP1: 'With over 10 years of experience in wellness and cold therapy, Dan Hayat has helped hundreds of people transform their lives through the power of cold exposure and breathwork.',
      aboutP2: 'Trained in the Wim Hof Method and certified in cryotherapy techniques, Dan combines ancient wisdom with modern science to create a unique and effective approach to cold therapy.',
      aboutCert: 'Certified Expert',
      aboutCertDesc: 'Wim Hof Method Instructor & Cryotherapy Specialist',
      aboutExp: '10+ Years Experience',
      aboutExpDesc: 'Helping clients achieve peak performance and wellness',
      aboutPassion: 'Passionate About Wellness',
      aboutPassionDesc: 'Dedicated to transforming lives through cold therapy',
      aboutQuote: '"Cold therapy isn\'t just about enduring the cold—it\'s about discovering your inner strength and unlocking your body\'s natural healing potential."',
      videoTitle: 'See Cold Therapy in Action',
      videoSubtitle: 'Watch how our sessions transform lives',
      videoComingSoon: 'More Videos Coming Soon',
      videoStayTuned: 'Stay tuned!',
      videoCTA: 'Ready to experience it yourself?',
      videoButton: 'Book Your First Session',
      faqTitle: 'Frequently Asked Questions',
      faqSubtitle: 'Everything you need to know about cold therapy',
      faq1Q: 'What is cold therapy?',
      faq1A: 'Cold therapy, also known as cryotherapy, involves exposing your body to extremely cold temperatures for therapeutic benefits. Our ice bath sessions help reduce inflammation, boost recovery, enhance mental clarity, and strengthen your immune system.',
      faq2Q: 'Is it safe for beginners?',
      faq2A: 'Absolutely! Our sessions are guided by experienced professionals who ensure your safety and comfort. We start with shorter durations and gradually build up your tolerance. We also teach proper breathing techniques to help you manage the cold exposure effectively.',
      faq3Q: 'What should I bring?',
      faq3A: 'Just bring yourself and comfortable clothing! We provide towels, robes, and all necessary amenities. We recommend wearing a swimsuit for the ice bath session. Arrive 10 minutes early for your first session to complete a brief health questionnaire.',
      faq4Q: 'How long is each session?',
      faq4A: 'Each session lasts approximately 30-45 minutes total, including preparation, the ice bath (typically 10-15 minutes), breathing exercises, and a warm-up period. The actual cold exposure time varies based on your experience level and comfort.',
      faq5Q: 'What are the main benefits?',
      faq5A: 'Cold therapy offers numerous benefits including reduced inflammation, faster muscle recovery, improved circulation, enhanced immune function, better sleep quality, increased mental resilience, stress reduction, and elevated mood through endorphin release.',
      galleryTitle: 'Experience Gallery',
      gallerySubtitle: 'See what our cold therapy sessions look like',
      galleryInstagram: 'Follow us on Instagram for more updates',
      photoGalleryTitle: 'Our Facilities',
      photoGallerySubtitle: 'Take a look at our cold therapy center',
      gallery1Title: 'Yoga with Miki Yogiki',
      gallery1Desc: 'Join our special yoga sessions',
      gallery2Title: 'Upcoming Events',
      gallery2Desc: 'Check out our latest events',
      adminButton: 'Admin',
      uploadSchedule: 'Upload Event Schedule',
      scheduleTitle: 'Event Schedule',
      scheduleSubtitle: 'Check out our upcoming sessions and events',
      enterPassword: 'Enter Password',
      login: 'Login',
      wrongPassword: 'Wrong password!',
      whyIceBathTitle: 'Why Ice Bath Therapy?',
      whyIceBathSubtitle: 'Discover the powerful benefits of cold water immersion',
      whyBenefit1Title: 'Stress Management',
      whyBenefit1Desc: 'Effective stress management and nervous system training to release it through ice bath immersion',
      whyBenefit2Title: 'Boost Immune System',
      whyBenefit2Desc: 'Strengthen immune system, blood circulation while reducing heart load and increasing cold resistance',
      whyBenefit3Title: 'Fast Recovery',
      whyBenefit3Desc: 'Quick recovery from injuries, accelerate anti-inflammatory processes and boost dopamine production (250% above normal!)',
      whyBenefit4Title: 'Mental Improvement',
      whyBenefit4Desc: 'Improve mental state and strengthen sense of capability while improving decision-making abilities in life',
      ourClientsTitle: 'Our Clients',
      ourClientsSubtitle: 'Trusted by leading organizations',
      clientEnterprise: 'Enterprise',
      clientFitness: 'Fitness Centers',
      clientSports: 'Sports Teams',
      clientWellness: 'Wellness Centers',
      contactTitle: 'Contact Us',
      contactPhone: '+972-052-434-3975',
      contactAddress: 'Ben Yehuda 30, Herzliya, Israel',
      contactPhoneLabel: 'Phone',
      contactLocationLabel: 'Location',
      followUs: 'Follow Us',
      instructorTitle: 'Instructor Training in Our Method',
      instructorP1: 'After more than 12,000 people have participated in our workshops, and millions more practicing similar methods worldwide, we can say with certainty that we are in the midst of a health revolution on a scale humanity has never known.',
      instructorP2: 'The masses are slowly being exposed to tools that were previously reserved mainly for elite athletes, ancient cultures, and groups of people researching longevity and resilience science.',
      instructorP3: 'Today, it\'s a great privilege that ice baths are trendy and conquering the mainstream!',
      instructorP4: 'We have the opportunity to take the practice to the next level, and start spreading it to people, and also make a living from it. To earn a dignified living from a practice that brings much healing to the world, and no less important, opens hearts and brings a huge smile to people\'s faces.',
      instructorP5: 'We\'ve developed models and protocols that combine breathing processes, together with controlled exposure to cold and heat, in order to give people an experience of total release, and a deep connection to understanding that our good feeling doesn\'t depend on anything.',
      instructorP6: 'We have the ability to feel good, no matter how much reality outside bites and grinds, and all we need to do is agree to experience ourselves in controlled stress situations, in order to create unshakeable mental and physiological resilience.',
      instructorP7: 'Our method emphasizes entering Fight or Flight states, in order to learn to create absolute calm in the most intense situations, and thus helps us connect to a deep intelligence that lies deep within us. A kind of inner voice we\'ve forgotten exists. A knowing that we are above this body, above this world.',
      instructorP8: 'We learn to connect to a state of mind where we cannot be stopped.',
      instructorP9: 'And we\'re going to teach you everything. No secrets.',
      instructorP10: 'We\'re going to teach you how to hold healing spaces, through protocols of breathing and exposure to cold and heat, and also how to make a living from it and build your professional identity.',
      instructorP11: 'The field is just beginning, demand is only going to increase, and now is the most precise time to enter.',
      footer: '© 2025 Cold Therapy by Dan Hayat. All rights reserved.',
      footerTagline: 'Transform your life through the power of cold and breath'
    },
    he: {
      logo: 'טיפול בקור',
      logoSubtitle: 'מאת דן חיאט',
      menu: 'תפריט',
      home: 'בית',
      about: 'אודות',
      packages: 'חבילות',
      gallery: 'גלריה',
      contact: 'צור קשר',
      heroTitle: 'שנה את',
      heroSubtitle: 'הגוף והנפש שלך',
      heroDescription: 'חווה את כוח הטיפול בקור ותרגילי הנשימה. חזק את המערכת החיסונית, הפחת מתח ושחרר את הפוטנציאל המלא שלך.',
      viewPackages: 'צפה בחבילות',
      bookNow: 'הזמן עכשיו',
      benefitIceBath: 'טיפול באמבט קרח',
      benefitIceBathDesc: 'טבול במים קרים להפחתת דלקות, שיפור ההתאוששות והגברת הבהירות המנטלית',
      benefitBreathing: 'טכניקות נשימה',
      benefitBreathingDesc: 'שלוט בשיטות נשימה עוצמתיות להפחתת מתח, הגברת אנרגיה ושיפור הרווחה הכללית',
      benefitGuided: 'סשנים מודרכים',
      benefitGuidedDesc: 'סשנים בהנחיית מומחים המשלבים חשיפה לקור ותרגילי נשימה לתוצאות מקסימליות ובטיחות',
      packagesTitle: 'בחר את החבילה שלך',
      packagesSubtitle: 'בחר את התוכנית המושלמת למסע הבריאות שלך',
      package1Title: 'כרטיסיה - 10 כניסות',
      package1Price: '700',
      package1Feature1: '10 כניסות בתוקף למשך 3 חודשים מתאריך הרכישה',
      package1Feature2: 'הכניסה כוללת: כניסה, מגבת, סאונה, מקלחות חמות/קרות, כיסא עיסוי, תה צמחים ועוד',
      package1Feature3: 'סדנאות נשימה וטיפול בקור בבריכת הקרח',
      package2Title: 'מנוי חופשי-חודשי / 6 חודשים',
      package2Subtitle: 'הכי פופולרי',
      package2Price: '1500',
      package2PriceNote: '250 ₪/חודש',
      package2Feature1: 'כניסה חופשית לכל הפעילויות ללא הגבלה',
      package2Feature2: 'סדנאות טיפול בקור בבריכת הקרח',
      package2Feature3: 'הכניסה כוללת: כניסה, מגבת, סאונה, מקלחות חמות/קרות, כיסא עיסוי, תה צמחים ועוד. כולל גם סדנאות טיפול בקור בבריכת הקרח ואימונים אישיים',
      package2Feature4: 'אימונים אישיים',
      package2Feature5: 'השכרת בריכת הקרח',
      package3Title: 'מנוי חופשי-חודשי',
      package3Subtitle: 'הצעות שלנו',
      package3Price: '300',
      package3PriceNote: 'לחודש',
      package3Feature1: 'כניסה חופשית לכל הפעילויות ללא הגבלה',
      package3Feature2: 'סדנאות טיפול בקור בבריכת הקרח',
      package3Feature3: 'הכניסה כוללת: כניסה, מגבת, סאונה, מקלחות חמות/קרות, כיסא עיסוי, תה צמחים ועוד. כולל גם סדנאות טיפול בקור בבריכת הקרח ואימונים אישיים',
      popular: 'פופולרי',
      mostPopular: 'הכי פופולרי',
      bestValue: 'הצעות שלנו',
      save: 'חסוך',
      getStarted: 'התחל',
      bestValue: 'הערך הטוב ביותר',
      statsSessions: 'סשנים שהושלמו',
      statsSatisfaction: 'שיעור שביעות רצון',
      statsClients: 'לקוחות מרוצים',
      statsTemp: 'טמפרטורה ממוצעת',
      aboutTitle: 'הכר את דן חייט',
      aboutP1: 'עם למעלה מ-10 שנות ניסיון בבריאות וטיפול בקור, דן ט עזר למאות אנשים לשנות את חייהם באמצעות כוח החשיפה לקור ותרגילי הנשימה.',
      aboutP2: 'מאומן בשיטת וים הוף ומוסמך בטכניקות קריותרפיה, דן משלב חוכמה עתיקה עם מדע מודרני ליצירת גישה ייחודית ויעילה לטיפול בקור.',
      aboutCert: 'מומחה מוסמך',
      aboutCertDesc: 'מדריך שיטת וים הוף ומומחה קריותרפיה',
      aboutExp: 'למעלה מ-10 שנות ניסיון',
      aboutExpDesc: 'עוזר ללקוחות להשיג ביצועים ובריאות מיטביים',
      aboutPassion: 'נלהב מבריאות',
      aboutPassionDesc: 'מוקדש לשינוי חיים באמצעות טיפול בקור',
      aboutQuote: '"טיפול בקור אינו רק על סבילות הקור - זה על גילוי הכוח הפנימי שלך ושחרור פוטנציאל הריפוי הטבעי של הגוף."',
      videoTitle: 'ראה טיפול בקור בפעולה',
      videoSubtitle: 'צפה כיצד הסשנים שלנו משנים חיים',
      videoComingSoon: 'סרטונים נוספים בקרוב',
      videoStayTuned: 'הישאר מעודכן!',
      videoCTA: 'מוכן לחוות זאת בעצמך?',
      videoButton: 'הזמן את הסשן הראשון שלך',
      faqTitle: 'שאלות נפוצות',
      faqSubtitle: 'כל מה שצריך לדעת על טיפול בקור',
      faq1Q: 'מה זה טיפול בקור?',
      faq1A: 'טיפול בקור, המכונה גם קריותרפיה, כולל חשיפת הגוף לטמפרטורות קרות במיוחד לצורכי טיפול. סשני אמבט הקרח שלנו עוזרים להפחית דלקות, לשפר התאוששות, להגביר בהירות מנטלית ולחזק את המערכת החיסונית.',
      faq2Q: 'האם זה בטוח למתחילים?',
      faq2A: 'בהחלט! הסשנים שלנו מודרכים על ידי אנשי מקצוע מנוסים המבטיחים את הבטיחות והנוחות שלך. אנו מתחילים עם משכים קצרים יותר ובונים בהדרגה את הסבילות שלך. אנו גם מלמדים טכניקות נשימה נכונות כדי לעזור לך לנהל את החשיפה לקור ביעילות.',
      faq3Q: 'מה להביא?',
      faq3A: 'פשוט תביא את עצמך ובגדים נוחים! אנו מספקים מגבות, חלוקים וכל האביזרים הדרושים. אנו ממליצים ללבוש בגד ים לסשן אמבט הקרח. הגע 10 דקות מוקדם לסשן הראשון שלך כדי למלא שאלון בריאות קצר.',
      faq4Q: 'כמה זמן נמשך כל סשן?',
      faq4A: 'כל סשן נמשך בערך 30-45 דקות בסך הכל, כולל הכנה, אמבט הקרח (בדרך כלל 10-15 דקות), תרגילי נשימה ותקופת התחממות. זמן החשיפה לקור בפועל משתנה בהתאם לרמת הניסיון והנוחות שלך.',
      faq5Q: 'מהם היתרונות העיקריים?',
      faq5A: 'טיפול בקור מציע יתרונות רבים כולל הפחתת דלקות, התאוששות שרירים מהירה יותר, שיפור זרימת הדם, שיפור תפקוד חיסוני, איכות שינה טובה יותר, עמידות מנטלית מוגברת, הפחתת מתח ומצב רוח מוגבר באמצעות שחרור אנדורפינים.',
      galleryTitle: 'גלריית חוויות',
      gallerySubtitle: 'ראו כיצד נראים סשני הטיפול בקור שלנו',
      galleryInstagram: 'עקבו אחרינו באינסטגרם לעדכונים נוספים',
      photoGalleryTitle: 'המתקנים שלנו',
      photoGallerySubtitle: 'הצצה על מרכז הטיפול בקור שלנו',
      gallery1Title: 'יוגה עם מיקי יוגיקי',
      gallery1Desc: 'הצטרפו לסשני היוגה המיוחדים שלנו',
      gallery2Title: 'אירועים קרובים',
      gallery2Desc: 'בדקו את האירועים האחרונים שלנו',
      adminButton: 'מנהל',
      uploadSchedule: 'העלה לוח אירועים',
      scheduleTitle: 'לוח אירועים',
      scheduleSubtitle: 'בדקו את הסשנים והאירועים הקרובים שלנו',
      enterPassword: 'הזן סיסמה',
      login: 'התחבר',
      wrongPassword: 'סיסמה שגויה!',
      whyIceBathTitle: 'למה דווקא אמבטיית קרח?',
      whyIceBathSubtitle: 'גלה את היתרונות העוצמתיים של טבילה במי קרח',
      whyBenefit1Title: 'התמודדות',
      whyBenefit1Desc: 'התמודדות יעילה עם סטרס ואימון מערכת העצבים להוציא אותו החוצה ע"י טבילה במי קרח',
      whyBenefit2Title: 'חיזוק המערכת החיסונית',
      whyBenefit2Desc: 'חיזוק המערכת החיסונית, מערכת הדם תוך הורדת עומס מהלב והגברת עמידות לקור ע"י בריכת קרח',
      whyBenefit3Title: 'התאוששות מהירה מפציעות',
      whyBenefit3Desc: 'התאוששות מהירה מפציעות, האצת תהליכים אנטי דלקטיים והגברת ייצור דופמין (פי 250% מהנורמה!)',
      whyBenefit4Title: 'שיפור המצב המנטאלי',
      whyBenefit4Desc: 'שיפור המצב המנטאלי וחיזוק תחושת מסוגלות תוך שיפור ביכולת קבלת החלטות בחיים ע"י אמבטיית קרח',
      ourClientsTitle: 'בין לקוחותינו',
      ourClientsSubtitle: 'מהימנים על ידי ארגונים מובילים',
      clientEnterprise: 'ארגונים',
      clientFitness: 'מכוני כושר',
      clientSports: 'קבוצות ספורט',
      clientWellness: 'מרכזי בריאות',
      contactTitle: 'צור קשר',
      contactPhone: '052-434-3975',
      contactAddress: 'בן יהודה 30, הרצליה, ישראל',
      contactPhoneLabel: 'טלפון',
      contactLocationLabel: 'מיקום',
      followUs: 'עקבו אחרינו',
      instructorTitle: 'הכשרת מדריכים בשיטה שלנו',
      instructorP1: 'אחרי מעל ל-12,000 אנשים שעברו אצלנו בסדנאות, ועוד מיליונים שמתרגלים שיטות דומות ברחבי העולם, אנחנו יודעים להגיד בוודאות שאנחנו בעיצומה של מהפכה בריאותית ברמות שהאנושות עוד לא הכירה.',
      instructorP2: 'ההמונים לאט לאט נחשפים לכלים שהיו שמורים בעיקר לספורטאי על, תרבויות עתיקות וקבוצות של אנשים שחוקרים את מדע אריכות הימים והחוסן.',
      instructorP3: 'היום, זו זכות גדולה שאמבטיות קרח הן טרנדיות, וכובשות את המיינסטרים!',
      instructorP4: 'יש לנו הזדמנות לקחת את התרגול לרמה הבאה, ולהתחיל להפיץ אותו הלאה לאנשים, וגם להתפרנס מזה. להתפרנס בכבוד מתרגול שמביא הרבה ריפוי לעולם, ולא פחות חשוב מזה, פותח לבבות ומעלה לאנשים חיוך ענק על הפנים.',
      instructorP5: 'פיתחנו מודלים ופרוטוקולים משלבים תהליכי נשימה, ביחד עם חשיפה מבוקרת לקור וחום, על מנת להעביר אנשים חוויה של שחרור טוטאלי, וחיבור עמוק להבנה שההרגשה הטובה שלנו לא תלויה בדבר.',
      instructorP6: 'יש לנו את היכולת להרגיש טוב, לא משנה כמה המציאות בחוץ נושכת ושוחקת, וכל מה שעלינו לעשות הוא להסכים לחוות את עצמנו במצבי דחק מבוקרים, על מנת לייצר חוסן מנטאלי ופיזיולוגי שלא ניתן לערער.',
      instructorP7: 'השיטה שלנו שמה דגש על כניסה למצבים של Fight or Flight, על מנת ללמוד לייצר רגיעה מוחלטת במצבים האינטנסיביים ביותר, ובכך עוזרת לנו להתחבר לאינטיליגנציה עמוקה שנמצאת עמוק בתוכנו. מעין קול פנימי שכבר שכחנו שקיים. ידיעה שאנחנו מעל הגוף הזה, מעל העולם הזה.',
      instructorP8: 'אנחנו לומדים להתחבר לסטייט אוף מיינד שבו אי אפשר לעצור אותנו.',
      instructorP9: 'ואנחנו הולכים ללמד אתכם הכל. בלי סודות.',
      instructorP10: 'אנחנו הולכים ללמד אתכם כיצד להחזיק מרחבים מרפאים, באמצעות פרוטוקולים של נשימה וחשיפה לקור וחום, וגם איך להתפרנס מזה ולבנות את הזהות המקצועית שלכם.',
      instructorP11: 'התחום רק בתחילת דרכו, הביקוש רק הולך לעלות, ועכשיו זה הזמן המדויק ביותר להיכנס.',
      footer: '© 2025 טיפול בקור מאת דן חיאט. כל הזכויות שמורות.',
      footerTagline: 'שנה את חייך באמצעות כוח הקור והנשימה'
    }
  };

  const t = translations[language];

  const galleryItems = [
    { id: 1, emoji: '🧘', title: t.gallery1Title, gradient: 'from-purple-600/40 to-pink-500/40', description: t.gallery1Desc },
    { id: 2, emoji: '📅', title: t.gallery2Title, gradient: 'from-blue-500/40 to-cyan-600/40', description: t.gallery2Desc }
  ];

  useEffect(() => {
    // Auto-play music on load (with user interaction requirement)
    const playAudio = () => {
      if (audioRef.current) {
        audioRef.current.play().catch(() => {
          // Auto-play blocked, user needs to interact
          setIsPlaying(false);
        });
      }
    };
    
    document.addEventListener('click', playAudio, { once: true });
    
    // Mouse tracking for parallax effect
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth) * 100,
        y: (e.clientY / window.innerHeight) * 100
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    // Scroll reveal animation
    const handleScroll = () => {
      const reveals = document.querySelectorAll('.scroll-reveal');
      reveals.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        if (elementTop < window.innerHeight - elementVisible) {
          element.classList.add('revealed');
        }
      });
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initial check
    
    return () => {
      document.removeEventListener('click', playAudio);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const scrollToPackages = () => {
    setShowPackages(true);
    setTimeout(() => {
      packagesRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleImageUpload = (event, type, index = null) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageData = reader.result;
        
        if (type === 'schedule') {
          setScheduleImage(imageData);
          localStorage.setItem('scheduleImage', imageData);
        } else if (type === 'gallery' && index !== null) {
          const newGalleryImages = [...galleryImages];
          newGalleryImages[index] = imageData;
          setGalleryImages(newGalleryImages);
          localStorage.setItem('galleryImages', JSON.stringify(newGalleryImages));
        } else if (type === 'danPhoto') {
          setDanPhoto(imageData);
          localStorage.setItem('danPhoto', imageData);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLogin = () => {
    if (password === 'Coldislife') {
      setIsAuthenticated(true);
      setPassword('');
    } else {
      alert(t.wrongPassword);
      setPassword('');
    }
  };

  const handleAdminClose = () => {
    setShowAdmin(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Load images from localStorage on mount
  useEffect(() => {
    const savedSchedule = localStorage.getItem('scheduleImage');
    if (savedSchedule) {
      setScheduleImage(savedSchedule);
    }
    
    const savedGallery = localStorage.getItem('galleryImages');
    if (savedGallery) {
      setGalleryImages(JSON.parse(savedGallery));
    }
    
    const savedDanPhoto = localStorage.getItem('danPhoto');
    if (savedDanPhoto) {
      setDanPhoto(savedDanPhoto);
    }
  }, []);

  // Counter animation for stats
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !statsAnimated) {
            setStatsAnimated(true);
            
            // Animate sessions counter (500+)
            let sessions = 0;
            const sessionsInterval = setInterval(() => {
              sessions += 10;
              if (sessions >= 500) {
                setStatsSessions(500);
                clearInterval(sessionsInterval);
              } else {
                setStatsSessions(sessions);
              }
            }, 20);

            // Animate satisfaction counter (98%)
            let satisfaction = 0;
            const satisfactionInterval = setInterval(() => {
              satisfaction += 2;
              if (satisfaction >= 98) {
                setStatsSatisfaction(98);
                clearInterval(satisfactionInterval);
              } else {
                setStatsSatisfaction(satisfaction);
              }
            }, 20);

            // Animate clients counter (200+)
            let clients = 0;
            const clientsInterval = setInterval(() => {
              clients += 5;
              if (clients >= 200) {
                setStatsClients(200);
                clearInterval(clientsInterval);
              } else {
                setStatsClients(clients);
              }
            }, 20);

            // Animate temp counter (3°C)
            let temp = 0;
            const tempInterval = setInterval(() => {
              temp += 0.2;
              if (temp >= 3) {
                setStatsTemp(3);
                clearInterval(tempInterval);
              } else {
                setStatsTemp(temp);
              }
            }, 50);
          }
        });
      },
      { threshold: 0.5 }
    );

    if (statsRef.current) {
      observer.observe(statsRef.current);
    }

    return () => observer.disconnect();
  }, [statsAnimated]);

  return (
    <div className="relative w-full min-h-screen overflow-x-hidden bg-gradient-to-br from-cyan-950 via-blue-950 to-slate-900 scroll-smooth" dir={language === 'he' ? 'rtl' : 'ltr'}>
      {/* Background Music */}
      <audio ref={audioRef} loop>
        <source src="https://www.bensound.com/bensound-music/bensound-relaxing.mp3" type="audio/mpeg" />
      </audio>


      {/* Admin Button */}
      <button 
        onClick={() => setShowAdmin(!showAdmin)}
        className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-30 bg-cyan-500/20 backdrop-blur-md px-4 py-2 sm:px-5 sm:py-3 rounded-full border border-cyan-400/30 hover:bg-cyan-500/30 hover:scale-110 transition-all duration-300 pointer-events-auto text-xs sm:text-sm font-semibold text-white"
      >
        🔐 {t.adminButton}
      </button>

      {/* Admin Panel */}
      {showAdmin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm pointer-events-auto p-4 overflow-y-auto" onClick={handleAdminClose}>
          <div className="bg-gradient-to-br from-cyan-900/95 to-blue-900/95 backdrop-blur-md p-6 sm:p-8 rounded-3xl border-2 border-cyan-400/50 max-w-4xl w-full my-8" onClick={(e) => e.stopPropagation()}>
            {!isAuthenticated ? (
              <>
                <h3 className="text-2xl font-bold text-white mb-6 text-center">🔐 Admin Login</h3>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                  placeholder={t.enterPassword}
                  className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white placeholder-blue-300 focus:outline-none focus:border-cyan-400 mb-4"
                />
                <button 
                  onClick={handleLogin}
                  className="w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  {t.login}
                </button>
              </>
            ) : (
              <>
                <h3 className="text-3xl font-bold text-white mb-6 text-center">⚙️ Admin Panel</h3>
                
                {/* Section Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                  <button 
                    onClick={() => setAdminSection('schedule')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'schedule' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
                  >
                    📅 Schedule
                  </button>
                  <button 
                    onClick={() => setAdminSection('gallery')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'gallery' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
                  >
                    🖼️ Gallery
                  </button>
                  <button 
                    onClick={() => setAdminSection('danPhoto')}
                    className={`px-4 py-2 rounded-full font-semibold transition-all duration-300 whitespace-nowrap ${adminSection === 'danPhoto' ? 'bg-cyan-500 text-white' : 'bg-white/10 text-blue-200 hover:bg-white/20'}`}
                  >
                    👤 Dan's Photo
                  </button>
                </div>

                {/* Schedule Section */}
                {adminSection === 'schedule' && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white mb-4">Upload Event Schedule</h4>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'schedule')}
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                    />
                    {scheduleImage && (
                      <div className="mt-4">
                        <img src={scheduleImage} alt="Schedule Preview" className="w-full rounded-lg border-2 border-cyan-400/30" />
                      </div>
                    )}
                  </div>
                )}

                {/* Gallery Section */}
                {adminSection === 'gallery' && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white mb-4">Upload Gallery Images</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {galleryImages.map((img, index) => (
                        <div key={index} className="relative group">
                          <img 
                            src={img} 
                            alt={`Gallery ${index + 1}`} 
                            className="w-full h-40 object-cover rounded-lg border-2 border-cyan-400/30"
                          />
                          <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer rounded-lg">
                            <span className="text-white font-semibold">📷 Change</span>
                            <input 
                              type="file" 
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, 'gallery', index)}
                              className="hidden"
                            />
                          </label>
                          <div className="absolute top-2 left-2 bg-cyan-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {index + 1}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Dan's Photo Section */}
                {adminSection === 'danPhoto' && (
                  <div className="space-y-4">
                    <h4 className="text-xl font-semibold text-white mb-4">Upload Dan's Photo</h4>
                    <input 
                      type="file" 
                      accept="image/*"
                      onChange={(e) => handleImageUpload(e, 'danPhoto')}
                      className="w-full px-4 py-3 bg-white/10 border border-cyan-400/30 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-cyan-500 file:text-white hover:file:bg-cyan-600 cursor-pointer"
                    />
                    {danPhoto && (
                      <div className="mt-4">
                        <img src={danPhoto} alt="Dan Preview" className="w-full max-w-md mx-auto rounded-lg border-2 border-cyan-400/30" />
                      </div>
                    )}
                  </div>
                )}

                <button 
                  onClick={handleAdminClose}
                  className="mt-6 w-full py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300"
                >
                  ✓ Close & Save
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* 3D Background - Wellness Theme */}
      <div className="fixed inset-0 z-0 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 via-blue-500/10 to-purple-500/10 animate-pulse"></div>
        <div 
          className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-400/20 rounded-full blur-3xl animate-float"
          style={{ transform: `translate(${mousePosition.x * 0.05}px, ${mousePosition.y * 0.05}px)` }}
        ></div>
        <div 
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/20 rounded-full blur-3xl animate-float-delayed"
          style={{ transform: `translate(-${mousePosition.x * 0.03}px, -${mousePosition.y * 0.03}px)` }}
        ></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl animate-rotate"></div>
      </div>

      {/* Header with Logo and Navigation */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-gradient-to-b from-slate-900/95 to-transparent backdrop-blur-md border-b border-cyan-400/10 animate-fadeInDown">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <div className="flex-shrink-0">
              <div className="text-lg sm:text-xl md:text-2xl font-bold text-white">
                <span className="text-cyan-400">❄️</span> {t.logo}
              </div>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-8 rtl:space-x-reverse">
              <a href="#home" className="text-blue-200 hover:text-cyan-400 transition-colors duration-300 font-medium">{t.home}</a>
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
              <a 
                href="#home" 
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 text-blue-200 hover:text-cyan-400 hover:bg-cyan-400/10 rounded-lg transition-all duration-300 font-medium"
              >
                {t.home}
              </a>
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

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-4 left-4 right-4 z-30 md:hidden pointer-events-none">
        <button 
          onClick={scrollToPackages}
          className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold rounded-full shadow-2xl hover:shadow-cyan-500/50 transition-all duration-300 pointer-events-auto"
        >
          📞 {t.bookNow}
        </button>
      </div>

      {/* Hero Section */}
      <div id="home" className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 sm:px-8 md:px-16 lg:px-24 pt-20">
        <div className="text-center space-y-4 sm:space-y-6 max-w-4xl mt-12 sm:mt-20">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-white leading-tight px-2 animate-fadeInUp">
            {t.heroTitle}
            <span className="block bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300 bg-clip-text text-transparent animate-gradient">
              {t.heroSubtitle}
            </span>
          </h1>
          
          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-blue-100 leading-relaxed max-w-3xl mx-auto px-2 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
            {t.heroDescription}
          </p>

          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-6 sm:pt-8 justify-center pointer-events-auto px-4 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
            <button 
              onClick={scrollToPackages}
              className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 text-base sm:text-lg animate-glow relative overflow-hidden group"
            >
              <span className="relative z-10">{t.viewPackages}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
            <button className="w-full sm:w-auto px-8 sm:px-10 py-4 sm:py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border-2 border-cyan-400/50 hover:bg-white/20 hover:border-cyan-400 hover:scale-110 transition-all duration-300 text-base sm:text-lg relative overflow-hidden group">
              <span className="relative z-10">{t.bookNow}</span>
              <div className="absolute inset-0 animate-shimmer"></div>
            </button>
          </div>
        </div>

        {/* Benefits */}
        <div className="mt-16 sm:mt-24 md:mt-32 w-full max-w-6xl px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 pointer-events-auto">
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">❄️</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.benefitIceBath}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.benefitIceBathDesc}
              </p>
            </div>
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer" style={{ transitionDelay: '0.1s' }}>
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">🌬️</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.benefitBreathing}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.benefitBreathingDesc}
              </p>
            </div>
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer" style={{ transitionDelay: '0.2s' }}>
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">🧘</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.benefitGuided}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.benefitGuidedDesc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Packages Section */}
      {showPackages && (
        <div ref={packagesRef} className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/50 to-transparent">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4">
              {t.packagesTitle}
            </h2>
            <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4">
              {t.packagesSubtitle}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-7xl mx-auto pointer-events-auto">
              {/* Package 1: 10 Entries */}
              <div className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300">
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{t.package1Title}</h3>
                  <div className="text-5xl font-bold text-cyan-400 mb-6">₪{t.package1Price}</div>
                  <ul className="text-left space-y-3 mb-8 text-blue-100 text-sm">
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 mt-1">•</span>
                      <span>{t.package1Feature1}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 mt-1">•</span>
                      <span>{t.package1Feature2}</span>
                    </li>
                    <li className="flex items-start">
                      <span className="text-cyan-400 mr-2 mt-1">•</span>
                      <span>{t.package1Feature3}</span>
                    </li>
                  </ul>
                  <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300">
                    {t.bookNow}
                  </button>
                </div>
              </div>

              {/* Package 2: 6 Months - Most Popular */}
              <div className="bg-gradient-to-br from-cyan-800/50 to-blue-800/50 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-300/60 hover:border-cyan-300 hover:scale-105 transition-all duration-300 relative">
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-cyan-500 to-blue-600 text-white px-6 py-2 rounded-full text-sm font-bold">
                  {t.package2Subtitle}
                </div>
                <div className="text-center">
                  <h3 className="text-2xl font-bold text-white mb-2">{t.package2Title}</h3>
                  <div className="text-5xl font-bold text-cyan-300 mb-2">₪{t.package2Price}</div>
                  <div className="text-sm text-cyan-200 mb-6">{t.package2PriceNote}</div>
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
                  <button className="w-full py-4 bg-gradient-to-r from-cyan-400 to-blue-500 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300">
                    {t.getStarted}
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
                  <button className="w-full py-4 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-xl transition-all duration-300">
                    {t.bookNow}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Counter Section */}
      <div ref={statsRef} className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 scroll-reveal">
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">{statsSessions}+</div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">{t.statsSessions}</div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">{statsSatisfaction}%</div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">{t.statsSatisfaction}</div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">{statsClients}+</div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">{t.statsClients}</div>
            </div>
            <div className="text-center group cursor-pointer hover:scale-110 transition-transform duration-300">
              <div className="text-4xl sm:text-5xl md:text-6xl font-bold text-cyan-400 mb-1 sm:mb-2 group-hover:animate-pulse">{statsTemp.toFixed(1)}°C</div>
              <div className="text-white text-sm sm:text-base md:text-lg group-hover:text-cyan-300 transition-colors duration-300">{t.statsTemp}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Why Ice Bath Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t.whyIceBathTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4 scroll-reveal">
            {t.whyIceBathSubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 pointer-events-auto">
            <div className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer">
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">🧠</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.whyBenefit1Title}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit1Desc}
              </p>
            </div>

            <div className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer" style={{ transitionDelay: '0.1s' }}>
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">💪</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.whyBenefit2Title}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit2Desc}
              </p>
            </div>

            <div className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer" style={{ transitionDelay: '0.2s' }}>
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">⚡</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.whyBenefit3Title}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit3Desc}
              </p>
            </div>

            <div className="scroll-reveal bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-md p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-cyan-400/30 hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 group cursor-pointer" style={{ transitionDelay: '0.3s' }}>
              <div className="text-4xl sm:text-5xl mb-3 sm:mb-4 group-hover:scale-125 transition-all duration-300">🎯</div>
              <h3 className="text-white font-bold text-lg sm:text-xl mb-2 sm:mb-3 group-hover:text-cyan-400 transition-colors duration-300">{t.whyBenefit4Title}</h3>
              <p className="text-blue-200 text-sm sm:text-base leading-relaxed">
                {t.whyBenefit4Desc}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* About Dan Hayat Section */}
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
                          <div class="mt-4 text-blue-300 text-sm">Add photo to: public/dan-hayat.jpg</div>
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

      {/* Video Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4">
            {t.videoTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4">
            {t.videoSubtitle}
          </p>

          {/* Main Video */}
          <div className="relative rounded-3xl overflow-hidden border-4 border-cyan-400/30 mb-8 group scroll-reveal hover:border-cyan-400 hover:shadow-2xl hover:shadow-cyan-500/30 transition-all duration-500">
            <div className="aspect-video">
              <iframe 
                className="w-full h-full"
                src="https://www.youtube.com/embed/1uerS5JjjRI"
                title="Cold Therapy - Main Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          </div>

          {/* Video Grid */}
          <div className="grid md:grid-cols-2 gap-6">
            {/* Video 1 */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/30 group cursor-pointer hover:border-cyan-400 hover:shadow-xl hover:shadow-cyan-500/20 hover:scale-105 transition-all duration-500 scroll-reveal">
              <div className="aspect-video">
                <iframe 
                  className="w-full h-full"
                  src="https://www.youtube.com/embed/bdWnPq7MuWE"
                  title="Cold Therapy Session"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>

            {/* Video 2 - Placeholder for future video */}
            <div className="relative rounded-2xl overflow-hidden border-2 border-cyan-400/30 group cursor-pointer hover:border-cyan-400/60 transition-all duration-300 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
              <div className="aspect-video bg-gradient-to-br from-cyan-900/40 to-purple-900/40 backdrop-blur-sm flex items-center justify-center">
                <div className="text-center">
                  <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">🎥</div>
                  <div className="text-white font-semibold">{t.videoComingSoon}</div>
                  <div className="text-blue-200 text-sm mt-1">{t.videoStayTuned}</div>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-12">
            <p className="text-blue-200 mb-4">{t.videoCTA}</p>
            <button className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300 text-lg">
              {t.videoButton}
            </button>
          </div>
        </div>
      </div>

      {/* Event Schedule Section */}
      {scheduleImage && (
        <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
              {t.scheduleTitle}
            </h2>
            <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
              {t.scheduleSubtitle}
            </p>
            <div className="scroll-reveal bg-cyan-900/20 backdrop-blur-md p-4 sm:p-6 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 transition-all duration-500">
              <img 
                src={scheduleImage} 
                alt="Event Schedule" 
                className="w-full rounded-2xl"
              />
            </div>
          </div>
        </div>
      )}

      {/* Gallery Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4">
            {t.galleryTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4">
            {t.gallerySubtitle}
          </p>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {galleryItems.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => setSelectedImage(item)}
                className="scroll-reveal relative aspect-square rounded-2xl overflow-hidden group cursor-pointer transform transition-all duration-500 hover:scale-110 hover:shadow-2xl hover:shadow-cyan-500/30 hover:-rotate-2"
                style={{ transitionDelay: `${index * 0.05}s` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${item.gradient} backdrop-blur-sm flex flex-col items-center justify-center border-2 border-cyan-400/30 group-hover:border-cyan-400 transition-all duration-300`}>
                  <div className="text-center transform transition-transform duration-300 group-hover:scale-125">
                    <div className="text-6xl mb-3 group-hover:animate-bounce">{item.emoji}</div>
                    <div className="text-white font-semibold text-lg mb-2 group-hover:text-cyan-300 transition-colors duration-300">{item.title}</div>
                    <div className="text-blue-200 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 px-4">
                      {item.description}
                    </div>
                  </div>
                  <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-all duration-300"></div>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-blue-200 mb-4">{t.galleryInstagram}</p>
            <button className="px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-105 transition-all duration-300">
              @ColdTherapyDanHayat
            </button>
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-4xl w-full">
            {/* Close Button */}
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-8 sm:-top-12 right-0 text-white text-3xl sm:text-4xl hover:text-cyan-400 transition-colors duration-300"
            >
              ✕
            </button>

            {/* Modal Content */}
            <div 
              className={`bg-gradient-to-br ${selectedImage.gradient} backdrop-blur-xl rounded-2xl sm:rounded-3xl border-2 border-cyan-400/50 p-6 sm:p-8 md:p-12 transform transition-all duration-300`}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-center">
                <div className="text-6xl sm:text-7xl md:text-9xl mb-4 sm:mb-6 animate-bounce">{selectedImage.emoji}</div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-4">{selectedImage.title}</h3>
                <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-6 sm:mb-8 leading-relaxed">{selectedImage.description}</p>
                
                {/* Navigation Arrows */}
                <div className="flex justify-center gap-4">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
                      const prevIndex = currentIndex > 0 ? currentIndex - 1 : galleryItems.length - 1;
                      setSelectedImage(galleryItems[prevIndex]);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-cyan-400/50 hover:bg-white/20 transition-all duration-300"
                  >
                    ← Previous
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      const currentIndex = galleryItems.findIndex(item => item.id === selectedImage.id);
                      const nextIndex = currentIndex < galleryItems.length - 1 ? currentIndex + 1 : 0;
                      setSelectedImage(galleryItems[nextIndex]);
                    }}
                    className="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full border border-cyan-400/50 hover:bg-white/20 transition-all duration-300"
                  >
                    Next →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Photo Gallery Section */}
      <div id="gallery" className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t.photoGalleryTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 md:mb-16 text-base sm:text-lg px-4 scroll-reveal">
            {t.photoGallerySubtitle}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {galleryImages.map((img, index) => (
              <div key={index} className="scroll-reveal group relative overflow-hidden rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-500 cursor-pointer" style={{ transitionDelay: `${index * 0.1}s` }}>
                <div className="aspect-[4/5] relative">
                  <img 
                    src={img} 
                    alt={`Cold Therapy ${index + 1}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                </div>
              </div>
            ))}

            {/* Gallery Image 8 - Instagram CTA */}
            <div className="scroll-reveal group relative overflow-hidden rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400 hover:scale-105 transition-all duration-500 cursor-pointer" style={{ transitionDelay: '0.7s' }}>
              <a 
                href="https://www.instagram.com/dan_hayat/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="block aspect-[4/5] relative bg-gradient-to-br from-pink-500/20 to-purple-600/20 backdrop-blur-sm"
              >
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-8">
                  <svg className="w-20 h-20 text-cyan-400 mb-4 group-hover:scale-125 transition-transform duration-300" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                  </svg>
                  <h3 className="text-white font-bold text-2xl mb-2">{t.galleryInstagram}</h3>
                  <p className="text-cyan-300">@dan_hayat</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t.faqTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal" style={{ transitionDelay: '0.1s' }}>
            {t.faqSubtitle}
          </p>

          <div className="space-y-4 scroll-reveal" style={{ transitionDelay: '0.2s' }}>
            {/* FAQ 1 */}
            <div className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 1 ? null : 1)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">{t.faq1Q}</span>
                <span className="text-cyan-400 text-2xl">{openFaq === 1 ? '−' : '+'}</span>
              </button>
              {openFaq === 1 && (
                <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                  {t.faq1A}
                </div>
              )}
            </div>

            {/* FAQ 2 */}
            <div className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 2 ? null : 2)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">{t.faq2Q}</span>
                <span className="text-cyan-400 text-2xl">{openFaq === 2 ? '−' : '+'}</span>
              </button>
              {openFaq === 2 && (
                <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                  {t.faq2A}
                </div>
              )}
            </div>

            {/* FAQ 3 */}
            <div className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 3 ? null : 3)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">{t.faq3Q}</span>
                <span className="text-cyan-400 text-2xl">{openFaq === 3 ? '−' : '+'}</span>
              </button>
              {openFaq === 3 && (
                <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                  {t.faq3A}
                </div>
              )}
            </div>

            {/* FAQ 4 */}
            <div className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 4 ? null : 4)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">{t.faq4Q}</span>
                <span className="text-cyan-400 text-2xl">{openFaq === 4 ? '−' : '+'}</span>
              </button>
              {openFaq === 4 && (
                <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                  {t.faq4A}
                </div>
              )}
            </div>

            {/* FAQ 5 */}
            <div className="bg-cyan-900/20 backdrop-blur-md rounded-2xl border border-cyan-400/30 overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === 5 ? null : 5)}
                className="w-full px-8 py-6 text-left flex justify-between items-center hover:bg-cyan-900/30 transition-all duration-300"
              >
                <span className="text-white font-semibold text-lg">{t.faq5Q}</span>
                <span className="text-cyan-400 text-2xl">{openFaq === 5 ? '−' : '+'}</span>
              </button>
              {openFaq === 5 && (
                <div className="px-8 pb-6 text-blue-200 leading-relaxed">
                  {t.faq5A}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Our Clients Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-3 sm:mb-4 px-4 scroll-reveal">
            {t.ourClientsTitle}
          </h2>
          <p className="text-blue-200 text-center mb-8 sm:mb-12 text-base sm:text-lg px-4 scroll-reveal">
            {t.ourClientsSubtitle}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 scroll-reveal">
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏢</div>
                <p className="text-white text-sm font-semibold">{t.clientEnterprise}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏋️</div>
                <p className="text-white text-sm font-semibold">{t.clientFitness}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">⚽</div>
                <p className="text-white text-sm font-semibold">{t.clientSports}</p>
              </div>
            </div>
            <div className="bg-white/5 backdrop-blur-md p-6 rounded-2xl border border-cyan-400/20 hover:border-cyan-400/50 hover:scale-105 transition-all duration-300 flex items-center justify-center min-h-[120px]">
              <div className="text-center">
                <div className="text-4xl mb-2">🏥</div>
                <p className="text-white text-sm font-semibold">{t.clientWellness}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Instructor Training Section */}
      <div className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24 bg-gradient-to-b from-transparent via-slate-900/30 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12 px-4 scroll-reveal">
            {t.instructorTitle}
          </h2>
          
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 backdrop-blur-lg p-8 sm:p-12 rounded-3xl border-2 border-cyan-400/30 hover:border-cyan-400/50 transition-all duration-500 scroll-reveal">
            <div className="space-y-6 text-blue-100 leading-relaxed text-base sm:text-lg">
              <p className="text-cyan-200 font-semibold text-lg sm:text-xl">
                {t.instructorP1}
              </p>
              
              <p>{t.instructorP2}</p>
              
              <p className="text-cyan-300 font-semibold">
                {t.instructorP3}
              </p>
              
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
            
            <div className="mt-8 text-center">
              <button className="px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold text-lg rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 pointer-events-auto">
                {t.bookNow}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="relative z-20 py-12 sm:py-16 md:py-20 px-4 sm:px-8 md:px-16 lg:px-24">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white text-center mb-8 sm:mb-12 px-4 scroll-reveal">
            {t.contactTitle}
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8 scroll-reveal">
            <a 
              href={`tel:${t.contactPhone}`}
              className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 group pointer-events-auto"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📞</div>
                <h3 className="text-white font-bold text-xl mb-2">{t.contactPhoneLabel}</h3>
                <p className="text-cyan-300 text-lg" dir="ltr">{t.contactPhone}</p>
              </div>
            </a>

            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(t.contactAddress)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-gradient-to-br from-cyan-900/40 to-blue-900/40 backdrop-blur-lg p-8 rounded-3xl border-2 border-cyan-400/40 hover:border-cyan-400/80 hover:scale-105 transition-all duration-300 group pointer-events-auto"
            >
              <div className="text-center">
                <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">📍</div>
                <h3 className="text-white font-bold text-xl mb-2">{t.contactLocationLabel}</h3>
                <p className="text-cyan-300 text-lg">{t.contactAddress}</p>
              </div>
            </a>
          </div>

          <div className="mt-8 text-center">
            <h3 className="text-white font-bold text-2xl mb-6">{t.followUs}</h3>
            <div className="flex gap-4 justify-center">
              <a 
                href={`https://wa.me/972524343975`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                </svg>
                WhatsApp
              </a>
              <a 
                href="https://www.instagram.com/dan_hayat/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold rounded-full hover:shadow-2xl hover:scale-110 transition-all duration-300 pointer-events-auto"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="relative z-10 py-12 text-center text-blue-200 pointer-events-none">
        <p className="text-sm">{t.footer}</p>
        <p className="text-xs mt-2 text-blue-300">{t.footerTagline}</p>
      </footer>
    </div>
  );
}

export default App;
