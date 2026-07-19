/**
 * Live smoke test for the judge demo path.
 *
 * Requires NEXT_PUBLIC_CONVEX_URL (or CONVEX_URL) pointing at a running deployment.
 *
 *   export NEXT_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
 *   pnpm smoke:judge
 */
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";
import {
  decodeStage1Fragment,
  generateFlight,
} from "../packages/drop-engine/src/index.ts";
import { computeBadgeSeed, computeNullifier } from "../packages/shared/src/index.ts";

const JUDGE_DROP_ID = "drop-003";

function requireEnv(name: string): string {
  const value = process.env[name] ?? process.env.CONVEX_URL;
  if (name !== "NEXT_PUBLIC_CONVEX_URL" && value) return value;
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  if (!url) {
    console.error(
      "Missing NEXT_PUBLIC_CONVEX_URL — set it to your Convex deployment URL.",
    );
    process.exit(1);
  }
  return url;
}

function sessionId(label: string): string {
  return `smoke-${label}-${crypto.randomUUID()}`;
}

async function playJudgePath(
  client: ConvexHttpClient,
  walletSessionId: string,
  dropId: string,
) {
  const created = await client.mutation(api.flights.create, {
    dropId,
    walletSessionId,
  });

  const expected = generateFlight(dropId, created.flightId);
  const stage1Payload = expected.stage1.payload as {
    location: { channel: string; marker: string };
    waveform: string;
    metadataHint: string;
    channel: string;
  };
  const stage1Answer = decodeStage1Fragment(stage1Payload);
  if (stage1Answer !== expected.stage1Answer) {
    throw new Error("Stage 1 decode mismatch");
  }

  for (const [stage, answer] of [
    [1, stage1Answer],
    [2, expected.stage2Answer],
    [3, expected.stage3Answer],
  ] as const) {
    const result = await client.mutation(api.flights.submitStage, {
      flightId: created.flightId,
      walletSessionId,
      stage,
      answer,
    });
    if (!result.correct) {
      throw new Error(`Stage ${stage} rejected`);
    }
    if (stage === 3 && !result.claimReady) {
      throw new Error("Stage 3 did not mark claimReady");
    }
  }

  const creds = await client.action(api.flights.complete, {
    flightId: created.flightId,
    walletSessionId,
  });

  if (creds.completionCredential !== expected.completionCredential) {
    throw new Error("Credential mismatch after complete");
  }

  const claim = await client.mutation(api.flights.recordClaim, {
    flightId: created.flightId,
    walletSessionId,
  });

  const nullifier = computeNullifier(dropId, expected.privatePlayerSecret);
  const expectedBadge = computeBadgeSeed(
    dropId,
    nullifier,
    expected.credentialCommitment,
  );

  if (claim.badgeSeed !== expectedBadge) {
    throw new Error("Badge seed mismatch");
  }

  return { flightId: created.flightId, alias: claim.alias, badgeSeed: claim.badgeSeed };
}

async function main() {
  const url = requireEnv("NEXT_PUBLIC_CONVEX_URL");
  const client = new ConvexHttpClient(url);

  console.log(`Smoke test → ${url}`);

  await client.action(api.dropsActions.bootstrapActiveDrop, {});
  console.log("✓ bootstrapActiveDrop");

  const drop = await client.query(api.dropsQueries.getById, {
    dropId: JUDGE_DROP_ID,
    now: Date.now(),
  });

  if (!drop || drop.status !== "active") {
    throw new Error(
      `Judge drop ${JUDGE_DROP_ID} is not active (status=${drop?.status ?? "missing"})`,
    );
  }
  console.log(`✓ ${drop.name} is active`);

  const sessionA = sessionId("a");
  const runA = await playJudgePath(client, sessionA, JUDGE_DROP_ID);
  console.log(`✓ session A claimed Wing (${runA.alias})`);

  const sessionB = sessionId("b");
  const createdB = await client.mutation(api.flights.create, {
    dropId: JUDGE_DROP_ID,
    walletSessionId: sessionB,
  });
  const expectedB = generateFlight(JUDGE_DROP_ID, createdB.flightId);
  const expectedA = generateFlight(JUDGE_DROP_ID, runA.flightId);

  const crossCheck = await client.mutation(api.flights.submitStage, {
    flightId: createdB.flightId,
    walletSessionId: sessionB,
    stage: 1,
    answer: expectedA.stage1Answer,
  });

  if (crossCheck.correct) {
    throw new Error("Cross-session answer should be rejected");
  }
  console.log("✓ cross-session answers rejected");

  if (expectedA.stage2Answer === expectedB.stage2Answer) {
    throw new Error("Expected unique stage 2 answers across flights");
  }
  console.log("✓ per-flight uniqueness");

  const solvers = await client.query(api.solvers.list, {
    dropId: JUDGE_DROP_ID,
  });
  const found = solvers?.solvers.some((s) => s.alias === runA.alias);
  if (!found) {
    throw new Error("Solver board missing session A entry");
  }
  console.log("✓ solver board entry");

  console.log("\nAll judge smoke checks passed.");
}

main().catch((error) => {
  console.error("\n✗ smoke:judge failed:", error instanceof Error ? error.message : error);
  process.exit(1);
});
