import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  drops: defineTable({
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
  }).index("by_dropId", ["dropId"]),

  flights: defineTable({
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
  })
    .index("by_flightId", ["flightId"])
    .index("by_dropId", ["dropId"])
    .index("by_walletSession", ["walletSessionId"]),

  stageAttempts: defineTable({
    flightId: v.string(),
    stageNumber: v.number(),
    success: v.boolean(),
    attemptedAt: v.number(),
  }).index("by_flight", ["flightId"]),

  solvers: defineTable({
    dropId: v.string(),
    alias: v.string(),
    badgeSeed: v.string(),
    claimedAt: v.number(),
    flightId: v.string(),
  })
    .index("by_dropId", ["dropId"])
    .index("by_dropId_and_claimedAt", ["dropId", "claimedAt"])
    .index("by_flightId", ["flightId"]),
});
