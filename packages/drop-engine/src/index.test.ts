import { describe, expect, it } from "vitest";
import {
  buildStage1,
  decodeStage1Fragment,
  generateFlight,
  validateStageAnswer,
} from "./index";

describe("drop-engine", () => {
  it("generates unique stage 2 answers per flight seed", () => {
    const a = generateFlight("drop-001", "flight-a");
    const b = generateFlight("drop-001", "flight-b");
    expect(a.stage2Answer).not.toBe(b.stage2Answer);
    expect(a.credentialCommitment).not.toBe(b.credentialCommitment);
  });

  it("validates sequential stage answers for one flight", () => {
    const flight = generateFlight("drop-001", "flight-test");
    expect(
      validateStageAnswer(1, flight.stage1Answer, flight),
    ).toBe(true);
    expect(
      validateStageAnswer(2, flight.stage2Answer, flight),
    ).toBe(true);
    expect(
      validateStageAnswer(3, flight.stage3Answer, flight),
    ).toBe(true);
    expect(
      validateStageAnswer(1, "wrong", flight),
    ).toBe(false);
  });

  it("rejects another flight's answers", () => {
    const a = generateFlight("drop-001", "flight-1");
    const b = generateFlight("drop-001", "flight-2");
    expect(validateStageAnswer(1, a.stage1Answer, b)).toBe(false);
  });

  it("does not ship stage 1 answer in public payload", () => {
    const flight = generateFlight("drop-001", "flight-leak-test");
    const payload = flight.stage1.payload as Record<string, unknown>;
    const serialized = JSON.stringify(payload);

    expect(payload).not.toHaveProperty("hiddenFragment");
    expect(serialized).not.toContain(flight.stage1Answer);
    expect(serialized).not.toContain(flight.fragmentA);
  });

  it("derives stage 1 answer from clues only", () => {
    const flight = generateFlight("drop-001", "flight-decode-test");
    const payload = flight.stage1.payload as {
      location: { channel: string; marker: string };
      waveform: string;
      metadataHint: string;
      channel: string;
    };

    const decoded = decodeStage1Fragment(payload);
    expect(decoded).toBe(flight.stage1Answer);
    expect(validateStageAnswer(1, decoded, flight)).toBe(true);
  });

  it("uses non-derivable fragment A from public seed alone", () => {
    const flight = generateFlight("drop-001", "flight-random-a");
    expect(flight.fragmentA.startsWith("SIG-")).toBe(true);
    expect(flight.fragmentA).not.toBe(
      `SIG-${flight.publicSeed.slice(0, 6).toUpperCase()}`,
    );
  });
});

describe("buildStage1", () => {
  it("embeds fragment in waveform without exposing it directly", () => {
    const fragmentA = "SIG-DEADBE";
    const stage = buildStage1("abc123", fragmentA);
    const payload = stage.payload as Record<string, unknown>;
    expect(payload).not.toHaveProperty("hiddenFragment");
    expect(JSON.stringify(payload)).not.toContain(fragmentA);
  });
});
