import { describe, expect, it } from "vitest";
import { deriveWingParams, generateWingSvg } from "./index";

describe("wing-generator", () => {
  it("produces deterministic output for the same seed", () => {
    const a = generateWingSvg("abc123deadbeef", 120);
    const b = generateWingSvg("abc123deadbeef", 120);
    expect(a).toBe(b);
  });

  it("varies params across seeds", () => {
    const a = deriveWingParams("aaaaaaaa");
    const b = deriveWingParams("bbbbbbbb");
    expect(a.primaryColor).not.toBe(b.primaryColor);
  });
});
