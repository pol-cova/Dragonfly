import { v } from "convex/values";
import { query } from "./_generated/server";

function computeDropStatus(opensAt: number, closesAt: number, now: number) {
  if (now < opensAt) return "upcoming" as const;
  if (now <= closesAt) return "active" as const;
  return "closed" as const;
}

export const getActive = query({
  args: {},
  handler: async (ctx) => {
    const drop = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", "drop-001"))
      .first();

    if (!drop) return null;

    const now = Date.now();
    const status = computeDropStatus(drop.opensAt, drop.closesAt, now);
    const solvers = await ctx.db
      .query("solvers")
      .withIndex("by_dropId", (q) => q.eq("dropId", drop.dropId))
      .collect();

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
  args: {},
  handler: async () => {
    return {
      upcoming: {
        id: "drop-002",
        name: "Ghost Frequency",
        status: "upcoming" as const,
        opensAt: Date.now() + 14 * 24 * 60 * 60 * 1000,
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
