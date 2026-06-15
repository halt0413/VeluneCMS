import { describe, expect, test } from "vitest";
import { createApiUrl } from "../../src/lib/url.js";

describe("createApiUrl", () => {
  test("API URLにpathが含まれていても維持する", () => {
    expect(createApiUrl("https://example.com/api", "contents").toString()).toBe(
      "https://example.com/api/contents"
    );
  });

  test("先頭スラッシュ付きpathでもAPI URLのpathを維持する", () => {
    expect(createApiUrl("https://example.com/api", "/contents").toString()).toBe(
      "https://example.com/api/contents"
    );
  });

  test("末尾スラッシュ付きAPI URLでも二重スラッシュにしない", () => {
    expect(createApiUrl("https://example.com/api/", "contents").toString()).toBe(
      "https://example.com/api/contents"
    );
  });
});
