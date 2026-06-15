import { describe, expect, test } from "vitest";
import { parseOptions } from "../../src/lib/args.js";

describe("parseOptions", () => {
  test("値ありオプションを読み取る", () => {
    expect(parseOptions(["--api-url", "http://localhost:8787"])).toEqual({
      "api-url": "http://localhost:8787"
    });
  });

  test("値なしオプションはtrueとして読み取る", () => {
    expect(parseOptions(["--token"])).toEqual({
      token: true
    });
  });

  test("オプションではない引数は読み飛ばす", () => {
    expect(parseOptions(["pull", "--output", "velune.content.json"])).toEqual({
      output: "velune.content.json"
    });
  });
});
