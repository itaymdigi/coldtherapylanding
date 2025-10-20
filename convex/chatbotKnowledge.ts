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
          name: "10-Session Starter Pack - חבילת 10 כניסות",
          description: "Your gateway to transformation through cold therapy",
          benefits: ["Train on your schedule", "Maximum value per session", "Valid for 3 months"]
        },
        {
          type: "6-months",
          name: "6-Month Unlimited Access - מנוי 6 חודשים",
          description: "Commit to excellence, unlock your full potential",
          benefits: ["Unlimited ice bath sessions", "VIP priority booking", "Join our elite community"]
        },
        {
          type: "monthly",
          name: "Monthly All-Access Pass - מנוי חודשי",
          description: "Build unstoppable momentum with consistent practice",
          benefits: ["Flexible month-to-month", "Train like a pro", "See real results fast"]
        }
      ],
      benefits: [
        "Supercharge your immune system - חיזוק מערכת החיסון",
        "Crush inflammation & recover faster - הפחתת דלקות",
        "Unlock razor-sharp mental focus - שיפור בהירות מחשבתית",
        "Explosive energy all day long - עלייה ברמות האנרגיה",
        "Accelerate muscle recovery - שיפור התאוששות",
        "Melt away stress & anxiety - הפחתת מתח",
        "Sleep like never before - שיפור איכות השינה"
      ],
      faq: [
        {
          question: "What should I bring to my first session? - מה להביא לפגישה?",
          answer: "Just bring a towel, warm clothes for after, and your courage! We'll provide everything else you need. - הביאו מגבת, בגדים חמים לאחר מכן, ואומץ! אנחנו מספקים את כל השאר."
        },
        {
          question: "How cold is the ice bath? - כמה קר המים?",
          answer: "Our ice baths range from 2-8°C (35-46°F) - the perfect temperature for maximum benefits and transformation. - אמבטיות הקרח שלנו בין 2-8 מעלות צלזיוס - הטמפרטורה המושלמת לתוצאות מקסימליות."
        },
        {
          question: "I'm a complete beginner - is this safe for me? - האם זה בטוח למתחילים?",
          answer: "Absolutely! Dan personally guides every session and ensures your safety. We'll start easy and build your resilience step by step. - בהחלט! דן מדריך אישית כל פגישה ומבטיח את בטחונך. נתחיל בקלות ונבנה את החוסן שלך צעד אחר צעד."
        },
        {
          question: "How long is each session? - כמה זמן נמשכות הפגישות?",
          answer: "Each transformative session lasts 60-90 minutes, including powerful breathing exercises and the ice bath experience. - כל פגישה משנת חיים נמשכת 60-90 דקות, כולל תרגילי נשימה עוצמתיים וחוויית אמבט הקרח."
        }
      ],
      breathingTechniques: [
        "Wim Hof Method - שיטת ווים הוף",
        "Box Breathing - נשימת קופסה",
        "4-7-8 Technique - נשימת 4-7-8",
        "Holotropic Breathwork - נשימה הולוטרופית"
      ]
    };
  },
});
