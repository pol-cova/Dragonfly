import { v } from "convex/values";
import { action } from "./_generated/server";
import { internal } from "./_generated/api";

export const bootstrapActiveDrop = action({
  args: {},
  returns: v.null(),
  handler: async (ctx) => {
    await ctx.runMutation(internal.drops.ensureSeeded, {});
    return null;
  },
});
