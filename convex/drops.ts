import { v } from "convex/values";
import { internalMutation } from "./_generated/server";
import { ensureDropsSeeded, syncJudgeWindows } from "./lib/drops";

export const ensureSeeded = internalMutation({
  args: {},
  returns: v.number(),
  handler: async (ctx) => {
    const seeded = await ensureDropsSeeded(ctx);
    await syncJudgeWindows(ctx);
    return seeded;
  },
});
