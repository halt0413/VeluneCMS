import { afterEach, describe, expect, it, vi } from "vitest";
import { contentCollectionApi } from "../../src/infrastructure/contentCollection/contentCollectionApi";
import {
  cmsApiBaseUrl,
  createContentCollectionResource,
  createJsonResponse
} from "./helpers/apiResponseFixture";

describe("contentCollectionApi integration", () => {
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
          items: [createContentCollectionResource()],
          total: 1
        })
      )
    );

    await expect(contentCollectionApi.list()).resolves.toEqual([
      {
        createdAt: "2026-01-01T00:00:00.000Z",
        id: "collection-1",
        name: "Example Collection",
        slug: "example-collection",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    ]);
  });

  it("更新APIへPATCHしてupdatedをdomain型へ変換する", async () => {
    vi.stubEnv("CMS_API_BASE_URL", cmsApiBaseUrl);
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse({
        updated: createContentCollectionResource({
          name: "Updated Collection"
        })
      })
    );
    vi.stubGlobal("fetch", fetchMock);

    await expect(
      contentCollectionApi.update("collection-1", {
        name: "Updated Collection"
      })
    ).resolves.toMatchObject({
      id: "collection-1",
      name: "Updated Collection"
    });
    expect(fetchMock).toHaveBeenCalledWith(
      new URL("http://localhost:8787/api/content-collections/collection-1"),
      expect.objectContaining({
        body: JSON.stringify({
          name: "Updated Collection"
        }),
        method: "PATCH"
      })
    );
  });

  it("壊れたAPI responseはschema errorにする", async () => {
    vi.stubEnv("CMS_API_BASE_URL", "http://localhost:8787");
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        createJsonResponse({
          items: [
            {
              id: "broken-collection"
            }
          ],
          total: 1
        })
      )
    );

    await expect(contentCollectionApi.list()).rejects.toThrow();
  });
});
