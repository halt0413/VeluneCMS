import { describe, expect, it } from "vitest";
import { z } from "zod";
import { getValidationErrorMessage } from "../../../src/lib/validation";

describe("getValidationErrorMessage", () => {
  it("ZodErrorの最初のmessageを返す", () => {
    const result = z
      .object({
        title: z.string().min(1, "タイトルを入力してください")
      })
      .safeParse({
        title: ""
      });

    expect(result.success).toBe(false);

    if (!result.success) {
      expect(getValidationErrorMessage(result.error)).toBe(
        "タイトルを入力してください"
      );
    }
  });

  it("ZodErrorにissueがない場合はfallbackを返す", () => {
    expect(getValidationErrorMessage(new z.ZodError([]))).toBe(
      "入力内容を確認してください"
    );
  });

  it("ZodError以外はfallbackを返す", () => {
    expect(getValidationErrorMessage(new Error("network error"))).toBe(
      "入力内容を確認してください"
    );
  });
});
