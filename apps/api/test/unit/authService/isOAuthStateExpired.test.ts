import { describe, expect, it } from "vitest";
import { isOAuthStateExpired } from "../../../src/domain";

describe("isOAuthStateExpired", () => {
  it("TTLを超えていないstateは期限切れにしない", () => {
    expect(
      isOAuthStateExpired(
        "2026-01-01T00:00:00.000Z",
        "2026-01-01T00:04:59.000Z",
        300
      )
    ).toBe(false);
  });

  it("TTLを超えたstateは期限切れにする", () => {
    expect(
      isOAuthStateExpired(
        "2026-01-01T00:00:00.000Z",
        "2026-01-01T00:05:01.000Z",
        300
      )
    ).toBe(true);
  });

  it("TTLちょうどは期限切れにしない", () => {
    expect(
      isOAuthStateExpired(
        "2026-01-01T00:00:00.000Z",
        "2026-01-01T00:05:00.000Z",
        300
      )
    ).toBe(false);
  });
});
