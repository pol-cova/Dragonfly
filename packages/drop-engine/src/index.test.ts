import { describe, expect, it } from "vitest";
import {
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
});
