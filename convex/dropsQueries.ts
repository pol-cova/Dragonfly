import { v } from "convex/values";
import { query, type QueryCtx } from "./_generated/server";
import type { Doc } from "./_generated/dataModel";
import { FEATURED_DROP_ID, computeDropStatus } from "./lib/drops";

const dropPublicValidator = v.object({
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
});

async function toPublicDrop(ctx: QueryCtx, drop: Doc<"drops">, now: number) {
  const archived = drop.status === "archived";
  const status = computeDropStatus(drop.opensAt, drop.closesAt, now, archived);
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
}

export const getActive = query({
  args: { now: v.number() },
  returns: v.union(dropPublicValidator, v.null()),
  handler: async (ctx, args) => {
    const drops = await ctx.db.query("drops").take(50);
    if (drops.length === 0) return null;

    const publicDrops = await Promise.all(
      drops.map((drop) => toPublicDrop(ctx, drop, args.now)),
    );

    const featured = publicDrops.find(
      (d) => d.id === FEATURED_DROP_ID && d.status === "active",
    );
    if (featured) return featured;

    const active = publicDrops
      .filter((d) => d.status === "active")
      .sort((a, b) => a.closesAt - b.closesAt);
    return active[0] ?? null;
  },
});

export const getById = query({
  args: { dropId: v.string(), now: v.number() },
  returns: v.union(dropPublicValidator, v.null()),
  handler: async (ctx, args) => {
    const drop = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", args.dropId))
      .first();
    if (!drop) return null;
    return await toPublicDrop(ctx, drop, args.now);
  },
});

export const list = query({
  args: { now: v.number() },
  returns: v.object({
    drops: v.array(dropPublicValidator),
  }),
  handler: async (ctx, args) => {
    const drops = await ctx.db.query("drops").take(50);
    const publicDrops = await Promise.all(
      drops.map((drop) => toPublicDrop(ctx, drop, args.now)),
    );

    const rank = (status: string) => {
      if (status === "active") return 0;
      if (status === "upcoming") return 1;
      if (status === "closed") return 2;
      return 3;
    };

    publicDrops.sort((a, b) => {
      const byStatus = rank(a.status) - rank(b.status);
      if (byStatus !== 0) return byStatus;
      return a.opensAt - b.opensAt;
    });

    return { drops: publicDrops };
  },
});

export const getTeasers = query({
  args: { now: v.number() },
  returns: v.object({
    upcoming: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        status: v.literal("upcoming"),
        opensAt: v.number(),
        difficulty: v.string(),
      }),
    ),
    archived: v.array(
      v.object({
        id: v.string(),
        name: v.string(),
        status: v.literal("archived"),
        solverCount: v.number(),
      }),
    ),
  }),
  handler: async (ctx, args) => {
    const drops = await ctx.db.query("drops").take(50);
    const publicDrops = await Promise.all(
      drops.map((drop) => toPublicDrop(ctx, drop, args.now)),
    );

    return {
      upcoming: publicDrops
        .filter((d) => d.status === "upcoming")
        .sort((a, b) => a.opensAt - b.opensAt)
        .map((d) => ({
          id: d.id,
          name: d.name,
          status: "upcoming" as const,
          opensAt: d.opensAt,
          difficulty: d.difficulty,
        })),
      archived: publicDrops
        .filter((d) => d.status === "archived" || d.status === "closed")
        .map((d) => ({
          id: d.id,
          name: d.name,
          status: "archived" as const,
          solverCount: d.solverCount,
        })),
    };
  },
});
