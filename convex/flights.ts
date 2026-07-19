import { v } from "convex/values";
import { action, mutation, query } from "./_generated/server";
import { internal } from "./_generated/api";
import {
  buildStage1,
  buildStage2,
  buildStage3,
  generateFlight,
  validateStageAnswer,
} from "./lib/game";
import {
  computeBadgeSeed,
  computeNullifier,
  generateAlias,
  randomHex,
} from "./lib/game";
import {
  assertFlightOwner,
  assertValidWalletSessionId,
  MAX_ACTIVE_FLIGHTS_PER_SESSION,
} from "./lib/session";
import { ensureDropSeeded } from "./lib/drops";

const MAX_ATTEMPTS_PER_STAGE = 20;
const FLIGHT_TTL_MS = 4 * 60 * 60 * 1000;

function dropIsOpen(opensAt: number, closesAt: number, now: number) {
  return now >= opensAt && now <= closesAt;
}

function toPublicFlight(flight: {
  flightId: string;
  dropId: string;
  alias: string;
  publicSeed: string;
  credentialCommitment: string;
  currentStage: number;
  completedStages: number[];
  status: "active" | "completed" | "claimed" | "expired";
  expiresAt: number;
  fragmentA: string;
  fragmentB: string;
  badgeSeed?: string;
  claimedAt?: number;
}) {
  let stage;
  if (flight.status === "active" || flight.status === "completed") {
    if (flight.currentStage === 1) {
      stage = buildStage1(flight.publicSeed, flight.fragmentA);
    } else if (flight.currentStage === 2) {
      stage = buildStage2(flight.publicSeed, flight.fragmentA);
    } else if (flight.currentStage === 3) {
      stage = buildStage3(flight.publicSeed, flight.fragmentA, flight.fragmentB);
    }
  }

  return {
    flightId: flight.flightId,
    dropId: flight.dropId,
    alias: flight.alias,
    publicSeed: flight.publicSeed,
    credentialCommitment: flight.credentialCommitment,
    currentStage: flight.currentStage,
    completedStages: flight.completedStages,
    status: flight.status,
    expiresAt: flight.expiresAt,
    badgeSeed: flight.badgeSeed,
    claimedAt: flight.claimedAt,
    stage,
  };
}

export const create = mutation({
  args: {
    dropId: v.string(),
    walletSessionId: v.string(),
  },
  returns: v.object({
    flightId: v.string(),
    alias: v.string(),
    seed: v.string(),
    expiresAt: v.number(),
    stage: v.any(),
    credentialCommitment: v.string(),
  }),
  handler: async (ctx, args) => {
    assertValidWalletSessionId(args.walletSessionId);

    await ensureDropSeeded(ctx);

    const drop = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", args.dropId))
      .first();

    if (!drop) throw new Error("Drop not found");

    const now = Date.now();
    if (!dropIsOpen(drop.opensAt, drop.closesAt, now)) {
      throw new Error("Drop is not open for new Flights");
    }

    const activeFlights = await ctx.db
      .query("flights")
      .withIndex("by_walletSession", (q) =>
        q.eq("walletSessionId", args.walletSessionId),
      )
      .collect();
    const activeCount = activeFlights.filter(
      (f) => f.status === "active" && f.expiresAt > now,
    ).length;
    if (activeCount >= MAX_ACTIVE_FLIGHTS_PER_SESSION) {
      throw new Error("Too many active Flights for this session");
    }

    const flightId = crypto.randomUUID();
    const generated = generateFlight(args.dropId, flightId);
    const alias = generateAlias(generated.publicSeed);

    await ctx.db.insert("flights", {
      flightId,
      dropId: args.dropId,
      alias,
      walletSessionId: args.walletSessionId,
      publicSeed: generated.publicSeed,
      credentialCommitment: generated.credentialCommitment,
      completionCredential: generated.completionCredential,
      privatePlayerSecret: generated.privatePlayerSecret,
      fragmentA: generated.fragmentA,
      fragmentB: generated.fragmentB,
      stage1Answer: generated.stage1Answer,
      stage2Answer: generated.stage2Answer,
      stage3Answer: generated.stage3Answer,
      currentStage: 1,
      completedStages: [],
      status: "active",
      expiresAt: now + FLIGHT_TTL_MS,
    });

    return {
      flightId,
      alias,
      seed: generated.publicSeed,
      expiresAt: now + FLIGHT_TTL_MS,
      stage: generated.stage1,
      credentialCommitment: generated.credentialCommitment,
    };
  },
});

export const get = query({
  args: {
    flightId: v.string(),
    now: v.number(),
  },
  returns: v.union(v.any(), v.null()),
  handler: async (ctx, args) => {
    const flight = await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();

    if (!flight) return null;

    if (flight.status === "active" && args.now > flight.expiresAt) {
      return {
        ...toPublicFlight(flight),
        status: "expired" as const,
      };
    }

    return toPublicFlight(flight);
  },
});

export const submitStage = mutation({
  args: {
    flightId: v.string(),
    walletSessionId: v.string(),
    stage: v.number(),
    answer: v.string(),
  },
  returns: v.object({
    correct: v.boolean(),
    message: v.optional(v.string()),
    receipt: v.optional(v.string()),
    nextStage: v.optional(v.any()),
    claimReady: v.optional(v.boolean()),
  }),
  handler: async (ctx, args) => {
    const flight = await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();

    if (!flight) throw new Error("Flight not found");
    assertFlightOwner(flight, args.walletSessionId);
    if (flight.status !== "active") throw new Error("Flight is not active");
    if (Date.now() > flight.expiresAt) throw new Error("Flight expired");
    if (args.stage !== flight.currentStage) throw new Error("Stage locked");

    const attempts = await ctx.db
      .query("stageAttempts")
      .withIndex("by_flight", (q) => q.eq("flightId", args.flightId))
      .collect();
    const stageAttempts = attempts.filter((a) => a.stageNumber === args.stage);
    if (stageAttempts.length >= MAX_ATTEMPTS_PER_STAGE) {
      throw new Error("Too many attempts on this stage");
    }

    const correct = validateStageAnswer(args.stage, args.answer, {
      stage1Answer: flight.stage1Answer,
      stage2Answer: flight.stage2Answer,
      stage3Answer: flight.stage3Answer,
      publicSeed: flight.publicSeed,
      fragmentA: flight.fragmentA,
    });

    await ctx.db.insert("stageAttempts", {
      flightId: args.flightId,
      stageNumber: args.stage,
      success: correct,
      attemptedAt: Date.now(),
    });

    if (!correct) {
      return {
        correct: false,
        message: "The signal does not match.",
      };
    }

    const completedStages = [...flight.completedStages, args.stage];
    const nextStage = args.stage + 1;
    const isFinal = args.stage === 3;

    await ctx.db.patch(flight._id, {
      completedStages,
      currentStage: isFinal ? 3 : nextStage,
      status: isFinal ? "completed" : "active",
    });

    const receipt = randomHex(16);
    let nextStageContent;
    if (nextStage === 2) {
      nextStageContent = buildStage2(flight.publicSeed, flight.fragmentA);
    } else if (nextStage === 3) {
      nextStageContent = buildStage3(
        flight.publicSeed,
        flight.fragmentA,
        flight.fragmentB,
      );
    }

    return {
      correct: true,
      receipt,
      nextStage: nextStageContent,
      claimReady: isFinal,
    };
  },
});

export const complete = action({
  args: {
    flightId: v.string(),
    walletSessionId: v.string(),
  },
  returns: v.object({
    claimReady: v.boolean(),
    completionCredential: v.string(),
    privatePlayerSecret: v.string(),
    credentialCommitment: v.string(),
    dropId: v.string(),
    flightId: v.string(),
    alias: v.string(),
  }),
  handler: async (ctx, args) => {
    assertValidWalletSessionId(args.walletSessionId);

    const flight = await ctx.runQuery(internal.flightsInternal.getSecretFlight, {
      flightId: args.flightId,
    });

    if (!flight) throw new Error("Flight not found");
    assertFlightOwner(flight, args.walletSessionId);
    if (flight.status !== "completed") throw new Error("Stages incomplete");
    if (flight.credentialReleasedAt) throw new Error("Credential already released");

    const drop = await ctx.runQuery(internal.flightsInternal.getDropById, {
      dropId: flight.dropId,
    });
    if (!drop) throw new Error("Drop not found");

    const now = Date.now();
    if (now < drop.opensAt || now > drop.closesAt) {
      throw new Error("Drop window closed");
    }

    await ctx.runMutation(internal.flightsInternal.markCredentialReleased, {
      flightId: args.flightId,
    });

    return {
      claimReady: true,
      completionCredential: flight.completionCredential,
      privatePlayerSecret: flight.privatePlayerSecret,
      credentialCommitment: flight.credentialCommitment,
      dropId: flight.dropId,
      flightId: flight.flightId,
      alias: flight.alias,
    };
  },
});

export const recordClaim = mutation({
  args: {
    flightId: v.string(),
    walletSessionId: v.string(),
  },
  returns: v.object({
    duplicate: v.boolean(),
    badgeSeed: v.string(),
    alias: v.string(),
    claimedAt: v.number(),
  }),
  handler: async (ctx, args) => {
    const flight = await ctx.db
      .query("flights")
      .withIndex("by_flightId", (q) => q.eq("flightId", args.flightId))
      .first();

    if (!flight) throw new Error("Flight not found");
    assertFlightOwner(flight, args.walletSessionId);

    if (flight.status === "claimed") {
      return {
        duplicate: true,
        badgeSeed: flight.badgeSeed!,
        alias: flight.alias,
        claimedAt: flight.claimedAt!,
      };
    }
    if (flight.status !== "completed") throw new Error("Flight not completed");
    if (!flight.credentialReleasedAt) {
      throw new Error("Completion credential not released");
    }

    const drop = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", flight.dropId))
      .first();
    if (!drop) throw new Error("Drop not found");

    const now = Date.now();
    if (now > drop.closesAt) throw new Error("Drop closed — Wing unavailable");

    const badgeSeed = computeBadgeSeed(
      flight.dropId,
      computeNullifier(flight.dropId, flight.privatePlayerSecret),
      flight.credentialCommitment,
    );

    await ctx.db.patch(flight._id, {
      status: "claimed",
      claimedAt: now,
      badgeSeed,
    });

    await ctx.db.insert("solvers", {
      dropId: flight.dropId,
      alias: flight.alias,
      badgeSeed,
      claimedAt: now,
      flightId: flight.flightId,
    });

    return {
      duplicate: false,
      badgeSeed,
      alias: flight.alias,
      claimedAt: now,
    };
  },
});
