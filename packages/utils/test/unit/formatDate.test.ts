import { describe, expect, test } from "vitest";
import { formatDate } from "../../src/date";

describe("formatDate", () => {
  test("既定では日本語ロケールの日付文字列へ変換する", () => {
    expect(formatDate("2026-01-02T00:00:00")).toBe("2026/01/02");
  });

  test("指定したロケールで日付文字列へ変換する", () => {
    expect(formatDate("2026-01-02T00:00:00", "en-US")).toBe("01/02/2026");
  });
});
