import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { ensureDropSeeded } from "./lib/drops";

export const ensureSeeded = internalMutation({
  args: {},
  returns: v.id("drops"),
  handler: async (ctx) => {
    return await ensureDropSeeded(ctx);
  },
});
