import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";

export const getSecretFlight = internalQuery({
  args: { flightId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();
  },
});

export const getDropById = internalQuery({
  args: { dropId: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", args.dropId))
      .first();
  },
});

export const markCredentialReleased = internalMutation({
  args: { flightId: v.string() },
  handler: async (ctx, args) => {
    const flight = await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();
    if (!flight) throw new Error("Flight not found");
    await ctx.db.patch(flight._id, {
      credentialReleasedAt: Date.now(),
    });
  },
});
