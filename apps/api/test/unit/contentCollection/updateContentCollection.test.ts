import { describe, expect, it } from "vitest";
import { updateContentCollection } from "../../../src/usecase/contentCollection";
import {
  createRepositoryWithCollection,
  TestContentCollectionRepository
} from "../helpers/contentCollectionUsecase";

describe("updateContentCollection", () => {
  it("コンテンツコレクションを更新する", async () => {
    const contentCollectionRepository =
      await createRepositoryWithCollection();

    await expect(
      updateContentCollection(
        "collection-1",
        {
          name: "Blog",
          slug: "blog collection"
        },
        {
          contentCollectionRepository,
          getNow: () => "2026-01-02T00:00:00.000Z"
        }
      )
    ).resolves.toMatchObject({
      createdAt: "2026-01-01T00:00:00.000Z",
      name: "Blog",
      slug: "blog-collection",
      updatedAt: "2026-01-02T00:00:00.000Z"
    });
  });

  it("存在しないidはNotFoundにする", async () => {
    const contentCollectionRepository = new TestContentCollectionRepository();

    await expect(
      updateContentCollection(
        "missing",
        {
          name: "Missing"
        },
        {
          contentCollectionRepository,
          getNow: () => "2026-01-02T00:00:00.000Z"
        }
      )
    ).rejects.toThrow("Content collection not found");
  });
});
