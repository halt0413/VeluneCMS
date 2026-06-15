import { describe, expect, test } from "vitest";
import { getOptionalStringOption } from "../../src/lib/args.js";

describe("getOptionalStringOption", () => {
  test("文字列のオプション値を返す", () => {
    expect(getOptionalStringOption({ output: "content.json" }, "output")).toBe(
      "content.json"
    );
  });

  test("未指定ならundefinedを返す", () => {
    expect(getOptionalStringOption({}, "output")).toBeUndefined();
  });

  test("値なし指定ならエラーを返す", () => {
    expect(() => getOptionalStringOption({ output: true }, "output")).toThrow(
      "--output requires a value."
    );
  });
});
