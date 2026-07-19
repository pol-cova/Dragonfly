import { z } from "zod";

export const DROP_ID = "drop-001" as const;

export const dropStatusSchema = z.enum([
  "upcoming",
  "active",
  "closed",
  "archived",
]);

export type DropStatus = z.infer<typeof dropStatusSchema>;

export const flightStatusSchema = z.enum([
  "active",
  "completed",
  "claimed",
  "expired",
]);

export type FlightStatus = z.infer<typeof flightStatusSchema>;

export const activeDropSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: dropStatusSchema,
  opensAt: z.number(),
  closesAt: z.number(),
  difficulty: z.string(),
  solverCount: z.number(),
  story: z.string().optional(),
  badgeTheme: z.string().optional(),
});

export type ActiveDrop = z.infer<typeof activeDropSchema>;

export const stageContentSchema = z.object({
  number: z.number(),
  title: z.string(),
  narrative: z.string(),
  objective: z.string(),
  hint: z.string().optional(),
  payload: z.record(z.string(), z.unknown()),
});

export type StageContent = z.infer<typeof stageContentSchema>;

export const flightPublicSchema = z.object({
  flightId: z.string(),
  dropId: z.string(),
  alias: z.string(),
  publicSeed: z.string(),
  credentialCommitment: z.string(),
  currentStage: z.number(),
  completedStages: z.array(z.number()),
  status: flightStatusSchema,
  expiresAt: z.number(),
  stage: stageContentSchema.optional(),
});

export type FlightPublic = z.infer<typeof flightPublicSchema>;

export const solverEntrySchema = z.object({
  alias: z.string(),
  badgeSeed: z.string(),
  claimedAt: z.number(),
});

export type SolverEntry = z.infer<typeof solverEntrySchema>;

export function normalizeAnswer(input: string): string {
  return input.trim().toLowerCase().replace(/\s+/g, " ");
}

export function generateAlias(seed: string): string {
  const hex = seed.slice(0, 4).toUpperCase();
  return `DRGN-${hex}`;
}

export const CREDENTIAL_DOMAIN = "dragonfly:credential:v1";
export const NULLIFIER_DOMAIN = "dragonfly:nullifier:v1";
export const BADGE_DOMAIN = "dragonfly:badge:v1";
