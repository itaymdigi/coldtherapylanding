import { query } from './_generated/server';

// Get general site statistics for homepage display
export const getSiteStats = query({
  args: {},
  handler: async (ctx) => {
    // Get total bookings count
    const totalBookings = await ctx.db
      .query('bookings')
      .collect();

    // Get total sessions count (from all users)
    const allSessions = await ctx.db
      .query('practiceSessions')
      .collect();

    // Get all users to calculate satisfaction (mock for now)
    const allUsers = await ctx.db
      .query('users')
      .collect();

    // Calculate average temperature from sessions
    const sessionsWithTemp = allSessions.filter(s => s.temperature !== undefined);
    const averageTemp = sessionsWithTemp.length > 0
      ? sessionsWithTemp.reduce((sum, s) => sum + (s.temperature || 0), 0) / sessionsWithTemp.length
      : 3.0; // fallback to 3°C

    return {
      totalSessions: allSessions.length,
      totalBookings: totalBookings.length,
      totalClients: allUsers.length,
      averageTemp: Math.round(averageTemp * 10) / 10, // round to 1 decimal
      satisfactionRate: 98, // hardcoded for now, could be calculated from feedback
    };
  },
});
