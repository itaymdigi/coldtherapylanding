import { query } from "./_generated/server";

// Get chatbot knowledge base (FAQ, packages, benefits)
export const getKnowledge = query({
  handler: async () => {
    return {
      business: {
        name: "Dan's Cold Therapy",
        description: "Professional ice bath and cold therapy sessions in Israel",
        instructor: "Dan - Certified Wim Hof Method instructor",
      },
      packages: [
        {
          type: "10-entries",
          name: "10 Entry Package  - חבילת 10 כניסות",
          description: "Perfect for getting started with cold therapy",
          benefits: ["Flexible scheduling", "Best value per session", "No expiration"]
        },
        {
          type: "6-months",
          name: "6 Month Membership - מנוי 6 חודשים",
          description: "Commit to your cold therapy journey",
          benefits: ["Unlimited sessions", "Priority booking", "Community access"]
        },
        {
          type: "monthly",
          name: "Monthly Subscription - מנוי חודשי",
          description: "Ongoing cold therapy practice",
          benefits: ["Cancel anytime", "Regular practice", "Consistent results"]
        }
      ],
      benefits: [
        "Improved immune system - חיזוק מערכת החיסון",
        "Reduced inflammation - הפחתת דלקות",
        "Better mental clarity - שיפור בהירות מחשבתית",
        "Increased energy levels - עלייה ברמות האנרגיה",
        "Enhanced recovery - שיפור התאוששות",
        "Stress reduction - הפחתת מתח",
        "Better sleep quality - שיפור איכות השינה"
      ],
      faq: [
        {
          question: "What should I bring to a session? - מה להביא לפגישה?",
          answer: "Bring a towel, warm clothes for after, and an open mind! We provide everything else. - הביאו מגבת, בגדים חמים לאחר מכן, ומוח פתוח! אנחנו מספקים את כל השאר."
        },
        {
          question: "How cold is the water? - כמה קר המים?",
          answer: "Our ice baths are typically between 2-8°C (35-46°F) for optimal benefits. - אמבטיות הקרח שלנו בדרך כלל בין 2-8 מעלות צלזיוס לתוצאות אופטימליות."
        },
        {
          question: "Is it safe for beginners? - האם זה בטוח למתחילים?",
          answer: "Absolutely! Dan guides every session and ensures your safety. We start gradually. - בהחלט! דן מדריך כל פגישה ומבטיח את בטחונך. אנחנו מתחילים בהדרגה."
        },
        {
          question: "How long are the sessions? - כמה זמן נמשכות הפגישות?",
          answer: "Sessions typically last 60-90 minutes including breathing exercises and ice bath. - הפגישות בדרך כלל נמשכות 60-90 דקות כולל תרגילי נשימה ואמבט קרח."
        }
      ],
      breathingTechniques: [
        "Wim Hof Method - שיטת ווים הוף",
        "Box Breathing - נשימת קופסה",
        "4-7-8 Breathing - נשימת 4-7-8",
        "Holotropic Breathing - נשימה הולוטרופית"
      ]
    };
  },
});
