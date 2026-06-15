import { afterEach, describe, expect, it, vi } from "vitest";
import { getCmsApiBaseUrl } from "../../../src/api/cms/getApiConfig";

describe("getCmsApiBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("CMS_API_BASE_URLを返す", () => {
    vi.stubEnv("CMS_API_BASE_URL", "http://localhost:8787");
    vi.stubEnv("API_URL", "http://localhost:9999");

    expect(getCmsApiBaseUrl()).toBe("http://localhost:8787");
  });

  it("API_URLをfallbackとして返す", () => {
    vi.stubEnv("API_URL", "http://localhost:8787");

    expect(getCmsApiBaseUrl()).toBe("http://localhost:8787");
  });

  it("API URLが未設定ならエラーにする", () => {
    vi.stubEnv("CMS_API_BASE_URL", "");
    vi.stubEnv("API_URL", "");

    expect(() => getCmsApiBaseUrl()).toThrow(
      "CMS_API_BASE_URL or API_URL is required"
    );
  });
});
