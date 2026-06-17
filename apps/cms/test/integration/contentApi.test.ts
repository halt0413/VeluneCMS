import { afterEach, describe, expect, it, vi } from "vitest";
import { contentApi } from "../../src/infrastructure/content/contentApi";
import {
  cmsApiBaseUrl,
  createJsonResponse,
  createPageResource,
  joinCmsTestApiUrl
} from "./helpers/apiResponseFixture";

describe("contentApi integration", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.unstubAllGlobals();
  });

  it("一覧API responseをdomain型へ変換する", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsApiBaseUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createJsonResponse({
          items: [createPageResource()],
          total: 1
        })
      )
    );

    await expect(contentApi.list()).resolves.toEqual([
      {
        body: "本文",
        contentType: "portfolio",
        createdAt: "2026-01-01T00:00:00.000Z",
        id: "page-1",
        slug: "example-page",
        status: "draft",
        title: "Example Page",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);
  });

  it("作成APIへPOSTしてcreatedをdomain型へ変換する", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsApiBaseUrl);
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        created: createPageResource({
          id: "page-created",
          slug: "created-page",
          title: "Created Page"
        })
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      contentApi.create({
        body: "本文",
        contentType: "portfolio",
        slug: "created-page",
        status: "draft",
        title: "Created Page"
      })
    ).resolves.toMatchObject({
      id: "page-created",
      slug: "created-page",
      title: "Created Page"
    });
    expect(fetchMock).toHaveBeenCalledWith(
      joinCmsTestApiUrl("contents"),
      expect.objectContaining({
        body: JSON.stringify({
          body: "本文",
          contentType: "portfolio",
          slug: "created-page",
          status: "draft",
          title: "Created Page"
        }),
        method: "POST"
      })
    );
  });

  it("壊れたAPI responseはschema errorにする", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsApiBaseUrl);
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createJsonResponse({
          items: [
            {
              id: "broken-page"
            }
          ],
          total: 1
        })
      )
    );

    await expect(contentApi.list()).rejects.toThrow();
  });
});
