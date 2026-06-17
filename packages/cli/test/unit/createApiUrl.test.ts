import { describe, expect, test } from "vitest";
import { createApiUrl } from "../../src/lib/url.js";
import { cliTestApiBaseUrl, joinCliTestUrl } from "../helpers/testEnv.js";

describe("createApiUrl", () => {
  test("API URLにpathが含まれていても維持する", () => {
    expect(createApiUrl(cliTestApiBaseUrl, "contents").toString()).toBe(
      joinCliTestUrl("contents")
    );
  });

  test("先頭スラッシュ付きpathでもAPI URLのpathを維持する", () => {
    expect(createApiUrl(cliTestApiBaseUrl, "/contents").toString()).toBe(
      joinCliTestUrl("contents")
    );
  });

  test("末尾スラッシュ付きAPI URLでも二重スラッシュにしない", () => {
    expect(createApiUrl(`${cliTestApiBaseUrl}/`, "contents").toString()).toBe(
      joinCliTestUrl("contents")
    );
  });
});
