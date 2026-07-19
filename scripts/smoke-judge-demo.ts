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
  reverseSubstitution,
  type Stage1Payload,
} from "../packages/drop-engine/src/index.ts";
import { normalizeAnswer } from "../packages/shared/src/index.ts";

const JUDGE_DROP_ID = "drop-003";

type StagePayload = {
  cipherKey?: string;
  cipherText?: string;
  fragmentA?: string;
  fragmentB?: string;
  flightTail?: string;
  coreClue?: string;
};

type StageContent = {
  number: number;
  payload: Stage1Payload | StagePayload;
};

function requireEnv(): string {
  const url = process.env.NEXT_PUBLIC_CONVEX_URL ?? process.env.CONVEX_URL;
  if (!url) {
    console.error(
      "Missing NEXT_PUBLIC_CONVEX_URL — set it to your Convex deployment URL.",
    );
    process.exit(1);
  }
  return url;
}

function sessionId(): string {
  // Must be a bare UUID — Convex rejects prefixed session ids.
  return crypto.randomUUID();
}

function solveStage1(stage: StageContent): string {
  return decodeStage1Fragment(stage.payload as Stage1Payload);
}

function solveStage2(stage: StageContent): string {
  const payload = stage.payload as StagePayload;
  if (!payload.cipherKey || !payload.cipherText) {
    throw new Error("Stage 2 payload missing cipher fields");
  }
  return reverseSubstitution(payload.cipherText, payload.cipherKey);
}

function solveStage3(stage: StageContent): string {
  const payload = stage.payload as StagePayload;
  if (
    !payload.fragmentA ||
    !payload.fragmentB ||
    !payload.flightTail ||
    !payload.coreClue
  ) {
    throw new Error("Stage 3 payload missing reconstruction fields");
  }
  return normalizeAnswer(
    `${payload.fragmentA}:${payload.fragmentB}:${payload.flightTail}:${payload.coreClue}`,
  );
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

  const stage1 = created.stage as StageContent;
  const stage1Answer = solveStage1(stage1);

  const stage1Result = await client.mutation(api.flights.submitStage, {
    flightId: created.flightId,
    walletSessionId,
    stage: 1,
    answer: stage1Answer,
  });
  if (!stage1Result.correct || !stage1Result.nextStage) {
    throw new Error("Stage 1 rejected");
  }

  const stage2Answer = solveStage2(stage1Result.nextStage as StageContent);
  const stage2Result = await client.mutation(api.flights.submitStage, {
    flightId: created.flightId,
    walletSessionId,
    stage: 2,
    answer: stage2Answer,
  });
  if (!stage2Result.correct || !stage2Result.nextStage) {
    throw new Error("Stage 2 rejected");
  }

  const stage3Answer = solveStage3(stage2Result.nextStage as StageContent);
  const stage3Result = await client.mutation(api.flights.submitStage, {
    flightId: created.flightId,
    walletSessionId,
    stage: 3,
    answer: stage3Answer,
  });
  if (!stage3Result.correct || !stage3Result.claimReady) {
    throw new Error("Stage 3 rejected or claim not ready");
  }

  const creds = await client.action(api.flights.complete, {
    flightId: created.flightId,
    walletSessionId,
  });
  if (!creds.completionCredential || !creds.privatePlayerSecret) {
    throw new Error("complete did not return credentials");
  }

  const claim = await client.mutation(api.flights.recordClaim, {
    flightId: created.flightId,
    walletSessionId,
  });
  if (!claim.badgeSeed || !claim.alias) {
    throw new Error("recordClaim missing badge or alias");
  }

  return {
    flightId: created.flightId,
    alias: claim.alias,
    badgeSeed: claim.badgeSeed,
    stage1Answer,
    stage2Answer,
  };
}

async function main() {
  const url = requireEnv();
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

  const runA = await playJudgePath(client, sessionId(), JUDGE_DROP_ID);
  console.log(`✓ session A claimed Wing (${runA.alias})`);

  const sessionB = sessionId();
  const createdB = await client.mutation(api.flights.create, {
    dropId: JUDGE_DROP_ID,
    walletSessionId: sessionB,
  });

  const crossCheck = await client.mutation(api.flights.submitStage, {
    flightId: createdB.flightId,
    walletSessionId: sessionB,
    stage: 1,
    answer: runA.stage1Answer,
  });

  if (crossCheck.correct) {
    throw new Error("Cross-session answer should be rejected");
  }
  console.log("✓ cross-session answers rejected");

  const stage1B = createdB.stage as StageContent;
  const stage1AnswerB = solveStage1(stage1B);
  const stage1BResult = await client.mutation(api.flights.submitStage, {
    flightId: createdB.flightId,
    walletSessionId: sessionB,
    stage: 1,
    answer: stage1AnswerB,
  });
  if (!stage1BResult.correct || !stage1BResult.nextStage) {
    throw new Error("Session B stage 1 failed");
  }
  const stage2AnswerB = solveStage2(stage1BResult.nextStage as StageContent);
  if (runA.stage2Answer === stage2AnswerB) {
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
  console.error(
    "\n✗ smoke:judge failed:",
    error instanceof Error ? error.message : error,
  );
  process.exit(1);
});
