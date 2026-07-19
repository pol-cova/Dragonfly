import { v } from "convex/values";
import { query } from "./_generated/server";

export const list = query({
  args: { dropId: v.string() },
  returns: v.object({
    solvers: v.array(
      v.object({
        alias: v.string(),
        badgeSeed: v.string(),
        claimedAt: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const solvers = await ctx.db
      .query("solvers")
      .withIndex("by_dropId_and_claimedAt", (q) => q.eq("dropId", args.dropId))
      .order("asc")
      .take(100);

    return {
      solvers: solvers.map((s) => ({
        alias: s.alias,
        badgeSeed: s.badgeSeed,
        claimedAt: s.claimedAt,
      })),
    };
  },
});
