import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { api } from "./_generated/api";

const http = httpRouter();

// Webhook endpoint for n8n chatbot
http.route({
  path: "/chatbot/webhook",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    const body = await request.json();
    
    // Log the incoming message
    console.log("Chatbot webhook received:", body);
    
    // Return success response
    return new Response(JSON.stringify({ 
      success: true,
      message: "Webhook received"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// Get chatbot knowledge base (FAQ, packages, benefits)
http.route({
  path: "/chatbot/knowledge",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const knowledgeBase = {
      business: {
        name: "Dan's Cold Therapy",
        description: "Professional ice bath and cold therapy sessions in Israel",
        instructor: "Dan - Certified Wim Hof Method instructor",
      },
      packages: [
        {
          type: "10-entries",
          name: "10 Entry Package",
          description: "Perfect for getting started with cold therapy",
          benefits: ["Flexible scheduling", "Best value per session", "No expiration"]
        },
        {
          type: "6-months",
          name: "6 Month Membership",
          description: "Commit to your cold therapy journey",
          benefits: ["Unlimited sessions", "Priority booking", "Community access"]
        },
        {
          type: "monthly",
          name: "Monthly Subscription",
          description: "Ongoing cold therapy practice",
          benefits: ["Cancel anytime", "Regular practice", "Consistent results"]
        }
      ],
      benefits: [
        "Improved immune system",
        "Reduced inflammation",
        "Better mental clarity",
        "Increased energy levels",
        "Enhanced recovery",
        "Stress reduction",
        "Better sleep quality"
      ],
      faq: [
        {
          question: "What should I bring to a session?",
          answer: "Bring a towel, warm clothes for after, and an open mind! We provide everything else."
        },
        {
          question: "How cold is the water?",
          answer: "Our ice baths are typically between 2-8°C (35-46°F) for optimal benefits."
        },
        {
          question: "Is it safe for beginners?",
          answer: "Absolutely! Dan guides every session and ensures your safety. We start gradually."
        },
        {
          question: "How long are the sessions?",
          answer: "Sessions typically last 60-90 minutes including breathing exercises and ice bath."
        }
      ],
      breathingTechniques: [
        "Wim Hof Method",
        "Box Breathing",
        "4-7-8 Breathing",
        "Holotropic Breathing"
      ]
    };

    return new Response(JSON.stringify(knowledgeBase), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

// Create booking via chatbot
http.route({
  path: "/chatbot/create-booking",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const body = await request.json();
      const { packageType, customerName, customerEmail, customerPhone } = body;

      // Validate required fields
      if (!packageType || !customerName || !customerEmail || !customerPhone) {
        return new Response(JSON.stringify({ 
          success: false,
          error: "Missing required fields"
        }), {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        });
      }

      // Create booking using the existing mutation
      const bookingId = await ctx.runMutation(api.bookings.createBooking, {
        packageType,
        customerName,
        customerEmail,
        customerPhone,
      });

      return new Response(JSON.stringify({ 
        success: true,
        bookingId,
        message: `Booking created successfully! We'll contact you at ${customerEmail} to confirm your session.`
      }), {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch (error) {
      console.error("Error creating booking:", error);
      return new Response(JSON.stringify({ 
        success: false,
        error: "Failed to create booking"
      }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }
  }),
});

// CORS preflight
http.route({
  path: "/chatbot/webhook",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/chatbot/knowledge",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

http.route({
  path: "/chatbot/create-booking",
  method: "OPTIONS",
  handler: httpAction(async () => {
    return new Response(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      },
    });
  }),
});

export default http;
