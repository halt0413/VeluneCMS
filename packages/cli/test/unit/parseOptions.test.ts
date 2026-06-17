import { describe, expect, test } from "vitest";
import { parseOptions } from "../../src/lib/args.js";
import { cliTestCmsApiUrl } from "../helpers/testEnv.js";

describe("parseOptions", () => {
  test("値ありオプションを読み取る", () => {
    expect(parseOptions(["--api-url", cliTestCmsApiUrl])).toEqual({
      "api-url": cliTestCmsApiUrl
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
