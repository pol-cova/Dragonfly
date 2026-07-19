import { describe, expect, it } from "vitest";
import {
  decodeStage1Fragment,
  generateFlight,
  validateStageAnswer,
} from "./index";
import {
  computeBadgeSeed,
  computeNullifier,
} from "@dragonfly/shared";

const JUDGE_DROP_ID = "drop-003";

describe("judge demo path", () => {
  it("solves Cipher Nest end-to-end for one flight", () => {
    const flightId = "judge-smoke-flight";
    const flight = generateFlight(JUDGE_DROP_ID, flightId);
    const payload = flight.stage1.payload as {
      location: { channel: string; marker: string };
      waveform: string;
      metadataHint: string;
      channel: string;
    };

    const stage1 = decodeStage1Fragment(payload);
    expect(stage1).toBe(flight.stage1Answer);
    expect(validateStageAnswer(1, stage1, flight)).toBe(true);
    expect(validateStageAnswer(2, flight.stage2Answer, flight)).toBe(true);
    expect(validateStageAnswer(3, flight.stage3Answer, flight)).toBe(true);
  });

  it("produces unique answers and badge seeds per flight", () => {
    const a = generateFlight(JUDGE_DROP_ID, "flight-a");
    const b = generateFlight(JUDGE_DROP_ID, "flight-b");

    expect(a.stage2Answer).not.toBe(b.stage2Answer);
    expect(validateStageAnswer(1, a.stage1Answer, b)).toBe(false);

    const badgeA = computeBadgeSeed(
      JUDGE_DROP_ID,
      computeNullifier(JUDGE_DROP_ID, a.privatePlayerSecret),
      a.credentialCommitment,
    );
    const badgeB = computeBadgeSeed(
      JUDGE_DROP_ID,
      computeNullifier(JUDGE_DROP_ID, b.privatePlayerSecret),
      b.credentialCommitment,
    );
    expect(badgeA).not.toBe(badgeB);
  });
});
