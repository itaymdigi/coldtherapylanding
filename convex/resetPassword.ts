import { v } from "convex/values";
import { mutation } from "./_generated/server";

// Simple hash function (same as in auth.ts)
function hashPassword(password: string): string {
  let hash = 0;
  for (let i = 0; i < password.length; i++) {
    const char = password.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return hash.toString(36);
}

// Reset password by email (for development/admin use)
export const resetPasswordByEmail = mutation({
  args: {
    email: v.string(),
    newPassword: v.string(),
  },
  handler: async (ctx, args) => {
    // Find user by email
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", args.email))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Update password
    await ctx.db.patch(user._id, {
      passwordHash: hashPassword(args.newPassword),
    });

    // Invalidate all existing session tokens
    const tokens = await ctx.db
      .query("sessionTokens")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    for (const token of tokens) {
      await ctx.db.delete(token._id);
    }

    return {
      success: true,
      message: "Password reset successfully. All sessions invalidated.",
    };
  },
});
