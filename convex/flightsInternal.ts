import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

const flightDocValidator = v.object({
  _id: v.id("flights"),
  _creationTime: v.number(),
  flightId: v.string(),
  dropId: v.string(),
  alias: v.string(),
  walletSessionId: v.string(),
  publicSeed: v.string(),
  credentialCommitment: v.string(),
  completionCredential: v.string(),
  privatePlayerSecret: v.string(),
  fragmentA: v.string(),
  fragmentB: v.string(),
  stage1Answer: v.string(),
  stage2Answer: v.string(),
  stage3Answer: v.string(),
  currentStage: v.number(),
  completedStages: v.array(v.number()),
  status: v.union(
    v.literal("active"),
    v.literal("completed"),
    v.literal("claimed"),
    v.literal("expired"),
  ),
  expiresAt: v.number(),
  credentialReleasedAt: v.optional(v.number()),
  claimedAt: v.optional(v.number()),
  badgeSeed: v.optional(v.string()),
});

const dropDocValidator = v.object({
  _id: v.id("drops"),
  _creationTime: v.number(),
  dropId: v.string(),
  name: v.string(),
  story: v.string(),
  opensAt: v.number(),
  closesAt: v.number(),
  difficulty: v.string(),
  badgeTheme: v.string(),
  status: v.union(
    v.literal("upcoming"),
    v.literal("active"),
    v.literal("closed"),
    v.literal("archived"),
  ),
});

export const getSecretFlight = internalQuery({
  args: { flightId: v.string() },
  returns: v.union(flightDocValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();
  },
});

export const getDropById = internalQuery({
  args: { dropId: v.string() },
  returns: v.union(dropDocValidator, v.null()),
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", args.dropId))
      .first();
  },
});

export const markCredentialReleased = internalMutation({
  args: { flightId: v.string() },
  returns: v.null(),
  handler: async (ctx, args) => {
    const flight = await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();
    if (!flight) throw new Error("Flight not found");
    await ctx.db.patch(flight._id, {
      credentialReleasedAt: Date.now(),
    });
    return null;
  },
});
