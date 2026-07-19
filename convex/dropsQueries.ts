import { v } from "convex/values";
import { query } from "./_generated/server";

function computeDropStatus(opensAt: number, closesAt: number, now: number) {
  if (now < opensAt) return "upcoming" as const;
  if (now <= closesAt) return "active" as const;
  return "closed" as const;
}

export const getActive = query({
  args: { now: v.number() },
  returns: v.union(
    v.object({
      id: v.string(),
      name: v.string(),
      status: v.union(
        v.literal("upcoming"),
        v.literal("active"),
        v.literal("closed"),
        v.literal("archived"),
      ),
      opensAt: v.number(),
      closesAt: v.number(),
      difficulty: v.string(),
      solverCount: v.number(),
      story: v.string(),
      badgeTheme: v.string(),
    }),
    v.null(),
  ),
  handler: async (ctx, args) => {
    const drop = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", "drop-001"))
      .first();

    if (!drop) return null;

    const status = computeDropStatus(drop.opensAt, drop.closesAt, args.now);
    const solvers = await ctx.db
      .query("solvers")
      .withIndex("by_dropId_and_claimedAt", (q) => q.eq("dropId", drop.dropId))
      .take(1000);

    return {
      id: drop.dropId,
      name: drop.name,
      status,
      opensAt: drop.opensAt,
      closesAt: drop.closesAt,
      difficulty: drop.difficulty,
      solverCount: solvers.length,
      story: drop.story,
      badgeTheme: drop.badgeTheme,
    };
  },
});

export const getTeasers = query({
  args: { now: v.number() },
  returns: v.object({
    upcoming: v.object({
      id: v.string(),
      name: v.string(),
      status: v.literal("upcoming"),
      opensAt: v.number(),
    }),
    archived: v.object({
      id: v.string(),
      name: v.string(),
      status: v.literal("archived"),
      solverCount: v.number(),
    }),
  }),
  handler: async (_ctx, args) => {
    return {
      upcoming: {
        id: "drop-002",
        name: "Ghost Frequency",
        status: "upcoming" as const,
        opensAt: args.now + 14 * 24 * 60 * 60 * 1000,
      },
      archived: {
        id: "drop-000",
        name: "First Light",
        status: "archived" as const,
        solverCount: 47,
      },
    };
  },
});
