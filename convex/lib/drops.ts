import type { MutationCtx } from "../_generated/server";

const HOUR = 60 * 60 * 1000;
const DAY = 24 * HOUR;

export type DropDefinition = {
  dropId: string;
  name: string;
  story: string;
  difficulty: "beginner" | "intermediate" | "advanced";
  badgeTheme: string;
  /** Offset from seed time for opensAt */
  opensOffsetMs: number;
  /** Offset from seed time for closesAt */
  closesOffsetMs: number;
  archived?: boolean;
};

/** Primary judge demo Drop — beginner, kept open during judging. */
export const JUDGE_PRIMARY_DROP_ID = "drop-003";
/** Secondary judge demo Drop. */
export const JUDGE_SECONDARY_DROP_ID = "drop-001";
/** How long judge Drops stay open after sync. */
export const JUDGE_WINDOW_CLOSE_MS = 14 * DAY;

const JUDGE_DROP_IDS = new Set([
  JUDGE_PRIMARY_DROP_ID,
  JUDGE_SECONDARY_DROP_ID,
]);

/**
 * Week-of catalog. Windows are relative to first seed time so a fresh
 * environment always has playable Drops for demos.
 */
export const DROP_CATALOG: DropDefinition[] = [
  {
    dropId: "drop-000",
    name: "First Light",
    story:
      "The original calibration Drop. Solvers mapped the first Dragonfly beacon and locked the Wing format forever.",
    difficulty: "beginner",
    badgeTheme: "first-light",
    opensOffsetMs: -10 * DAY,
    closesOffsetMs: -3 * DAY,
    archived: true,
  },
  {
    dropId: "drop-001",
    name: "The Silent Signal",
    story:
      "An unidentified transmission has appeared inside Dragonfly. Trace the signal, decode its contents, and reconstruct its source before the Drop closes.",
    difficulty: "intermediate",
    badgeTheme: "silent-signal",
    opensOffsetMs: -2 * HOUR,
    closesOffsetMs: 14 * DAY,
  },
  {
    dropId: "drop-002",
    name: "Ghost Frequency",
    story:
      "A phantom carrier is hopping between dead channels. Capture Fragment A from the noise floor, peel the cipher, and pin the ghost before it fades.",
    difficulty: "intermediate",
    badgeTheme: "ghost-frequency",
    opensOffsetMs: -1 * HOUR,
    closesOffsetMs: 4 * DAY,
  },
  {
    dropId: "drop-003",
    name: "Cipher Nest",
    story:
      "A beginner sprint built like a nest of interlocking ciphers. Soft onboarding, sharp payoff — perfect for a first Wing this week.",
    difficulty: "beginner",
    badgeTheme: "cipher-nest",
    opensOffsetMs: -1 * HOUR,
    closesOffsetMs: 14 * DAY,
  },
  {
    dropId: "drop-004",
    name: "Mirror Protocol",
    story:
      "Every answer reflects another. Follow the mirrored trail through recon, cryptography, and a terminal that only accepts the full reflection.",
    difficulty: "advanced",
    badgeTheme: "mirror-protocol",
    opensOffsetMs: 0,
    closesOffsetMs: 6 * DAY,
  },
  {
    dropId: "drop-005",
    name: "Ember Relay",
    story:
      "Hot-drop midweek. A dying relay is broadcasting in short bursts — solve fast or the embers go cold.",
    difficulty: "intermediate",
    badgeTheme: "ember-relay",
    opensOffsetMs: 7 * DAY,
    closesOffsetMs: 14 * DAY,
  },
  {
    dropId: "drop-006",
    name: "Null Harbor",
    story:
      "Something docks in the null zone with no registry entry. Recover the harbor key and prove you boarded without revealing how.",
    difficulty: "advanced",
    badgeTheme: "null-harbor",
    opensOffsetMs: 10 * DAY,
    closesOffsetMs: 17 * DAY,
  },
  {
    dropId: "drop-007",
    name: "Lattice Drift",
    story:
      "Weekend closer. The lattice is slipping out of phase — stabilize the signal and claim the final Wing of the week.",
    difficulty: "intermediate",
    badgeTheme: "lattice-drift",
    opensOffsetMs: 12 * DAY,
    closesOffsetMs: 19 * DAY,
  },
];

/** Featured Drop for hero / default board. */
export const FEATURED_DROP_ID = JUDGE_PRIMARY_DROP_ID;

export function computeDropStatus(
  opensAt: number,
  closesAt: number,
  now: number,
  archived = false,
) {
  if (archived || now > closesAt + 14 * DAY) return "archived" as const;
  if (now < opensAt) return "upcoming" as const;
  if (now <= closesAt) return "active" as const;
  return "closed" as const;
}

export async function ensureDropsSeeded(ctx: MutationCtx) {
  const now = Date.now();
  let seeded = 0;

  for (const drop of DROP_CATALOG) {
    const existing = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", drop.dropId))
      .first();

    if (existing) continue;

    const opensAt = now + drop.opensOffsetMs;
    const closesAt = now + drop.closesOffsetMs;
    await ctx.db.insert("drops", {
      dropId: drop.dropId,
      name: drop.name,
      story: drop.story,
      difficulty: drop.difficulty,
      badgeTheme: drop.badgeTheme,
      opensAt,
      closesAt,
      status: computeDropStatus(opensAt, closesAt, now, drop.archived),
    });
    seeded += 1;
  }

  return seeded;
}

/**
 * Keep judge Drops open through the judging window. Safe to call on every
 * bootstrap — patches existing rows without resetting puzzle data.
 */
export async function syncJudgeWindows(ctx: MutationCtx) {
  const now = Date.now();
  let updated = 0;

  for (const dropId of JUDGE_DROP_IDS) {
    const existing = await ctx.db
      .query("drops")
      .withIndex("by_dropId", (q) => q.eq("dropId", dropId))
      .first();

    if (!existing) continue;

    const opensAt = Math.min(existing.opensAt, now - HOUR);
    const closesAt = Math.max(existing.closesAt, now + JUDGE_WINDOW_CLOSE_MS);

    if (existing.opensAt === opensAt && existing.closesAt === closesAt) {
      continue;
    }

    await ctx.db.patch(existing._id, {
      opensAt,
      closesAt,
      status: computeDropStatus(opensAt, closesAt, now, existing.status === "archived"),
    });
    updated += 1;
  }

  return updated;
}

/** @deprecated use ensureDropsSeeded */
export async function ensureDropSeeded(ctx: MutationCtx) {
  await ensureDropsSeeded(ctx);
  const featured = await ctx.db
    .query("drops")
    .withIndex("by_dropId", (q) => q.eq("dropId", FEATURED_DROP_ID))
    .first();
  if (!featured) throw new Error("Featured drop missing after seed");
  return featured._id;
}
