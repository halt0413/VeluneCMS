import { afterEach, describe, expect, it, vi } from "vitest";
import { getCmsApiBaseUrl } from "../../../src/api/cms/getApiConfig";
import { cmsTestApiBaseUrl } from "../../helpers/testEnv";

describe("getCmsApiBaseUrl", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("CMS_API_BASE_URLを返す", () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsTestApiBaseUrl);
    vi.stubEnv("API_URL", `${cmsTestApiBaseUrl}/fallback`);

    expect(getCmsApiBaseUrl()).toBe(cmsTestApiBaseUrl);
  });

  it("API_URLをfallbackとして返す", () => {
    vi.stubEnv("API_URL", cmsTestApiBaseUrl);

    expect(getCmsApiBaseUrl()).toBe(cmsTestApiBaseUrl);
  });

  it("API URLが未設定ならエラーにする", () => {
    vi.stubEnv("CMS_API_BASE_URL", "");
    vi.stubEnv("API_URL", "");

    expect(() => getCmsApiBaseUrl()).toThrow(
      "CMS_API_BASE_URL or API_URL is required"
    );
  });
});
