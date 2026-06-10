import { describe, expect, it } from "vitest";
import { getContentCollection } from "../../../src/usecase/contentCollection";
import {
  createRepositoryWithCollection,
  TestContentCollectionRepository
} from "../helpers/contentCollectionUsecase";

describe("getContentCollection", () => {
  it("詳細を取得する", async () => {
    const contentCollectionRepository =
      await createRepositoryWithCollection();

    await expect(
      getContentCollection("collection-1", contentCollectionRepository)
    ).resolves.toMatchObject({
      id: "collection-1",
      slug: "my-portfolio"
    });
  });

  it("存在しないidはNotFoundにする", async () => {
    const contentCollectionRepository = new TestContentCollectionRepository();

    await expect(
      getContentCollection("missing", contentCollectionRepository)
    ).rejects.toThrow("Content collection not found");
  });
});
