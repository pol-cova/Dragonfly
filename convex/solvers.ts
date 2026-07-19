import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: { dropId: v.string() },
  handler: async (ctx, args) => {
    const solvers = await ctx.db
      .query("solvers")
      .withIndex("by_dropId", (q) => q.eq("dropId", args.dropId))
      .collect();

    return {
      solvers: solvers
        .sort((a, b) => a.claimedAt - b.claimedAt)
        .map((s) => ({
          alias: s.alias,
          badgeSeed: s.badgeSeed,
          claimedAt: s.claimedAt,
        })),
    };
  },
});
