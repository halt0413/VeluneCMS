import { afterEach, describe, expect, it, vi } from "vitest";
import { cmsFetch } from "../../../src/api/cms/client";
import {
  cmsTestApiBasePathUrl,
  cmsTestApiBaseUrl,
  joinCmsTestApiUrl
} from "../../helpers/testEnv";

describe("cmsFetch", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("既定でcookieを含めてJSONを取得する", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsTestApiBasePathUrl);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        headers: {
          "Content-Type": "application/json"
        },
        status: 200
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(cmsFetch<{ ok: boolean }>("contents")).resolves.toEqual({
      ok: true
    });
    expect(fetchMock).toHaveBeenCalledWith(
      joinCmsTestApiUrl("contents"),
      expect.objectContaining({
        cache: "no-store",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        }
      })
    );
  });

  it("initのcredentialsとheadersを優先する", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsTestApiBaseUrl);
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ ok: true }), {
        status: 200
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await cmsFetch<{ ok: boolean }>("contents", {
      credentials: "omit",
      headers: {
        Authorization: "Bearer token"
      }
    });

    expect(fetchMock).toHaveBeenCalledWith(
      new URL("/contents", cmsTestApiBaseUrl),
      expect.objectContaining({
        credentials: "omit",
        headers: {
          Authorization: "Bearer token",
          "Content-Type": "application/json"
        }
      })
    );
  });

  it("APIがerror bodyを返した場合はそのmessageでエラーにする", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsTestApiBaseUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401
        })
      )
    );

    await expect(cmsFetch("contents")).rejects.toThrow("Unauthorized");
  });

  it("APIのerror bodyを読めない場合はstatus付きmessageでエラーにする", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsTestApiBaseUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response("Internal Server Error", {
          status: 500
        })
      )
    );

    await expect(cmsFetch("contents")).rejects.toThrow(
      "CMS API request failed: 500"
    );
  });
});
