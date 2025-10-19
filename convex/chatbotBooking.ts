import { mutation } from "./_generated/server";
import { v } from "convex/values";

// Create a booking via chatbot
export const createChatbotBooking = mutation({
  args: {
    packageType: v.string(),
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate package type
    const validPackages = ["10-entries", "6-months", "monthly"];
    if (!validPackages.includes(args.packageType)) {
      throw new Error(`Invalid package type. Must be one of: ${validPackages.join(", ")}`);
    }

    // Create the booking
    const bookingId = await ctx.db.insert("bookings", {
      packageType: args.packageType,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      customerPhone: args.customerPhone,
      status: "pending",
      bookedAt: Date.now(),
    });

    return {
      success: true,
      bookingId,
      message: `Booking created successfully! Booking ID: ${bookingId}`,
      customerName: args.customerName,
      customerEmail: args.customerEmail,
      packageType: args.packageType,
    };
  },
});
