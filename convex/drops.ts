import { v } from "convex/values";
import { mutation } from "./_generated/server";

const DROP_001 = {
  dropId: "drop-001",
  name: "The Silent Signal",
  story:
    "An unidentified transmission has appeared inside Dragonfly. Trace the signal, decode its contents, and reconstruct its source before the Drop closes.",
  difficulty: "intermediate",
  badgeTheme: "silent-signal",
};

function computeDropStatus(opensAt: number, closesAt: number, now: number) {
  if (now < opensAt) return "upcoming" as const;
  if (now <= closesAt) return "active" as const;
  return "closed" as const;
}

export const seedDrops = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", DROP_001.dropId))
      .first();

    const now = Date.now();
    const opensAt = now - 60 * 60 * 1000;
    const closesAt = now + 7 * 24 * 60 * 60 * 1000;

    if (existing) {
      await ctx.db.patch(existing._id, {
        opensAt,
        closesAt,
        status: computeDropStatus(opensAt, closesAt, now),
      });
      return existing._id;
    }

    return await ctx.db.insert("drops", {
      ...DROP_001,
      opensAt,
      closesAt,
      status: computeDropStatus(opensAt, closesAt, now),
    });
  },
});
