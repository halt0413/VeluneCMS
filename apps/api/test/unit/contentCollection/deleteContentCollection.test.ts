import { describe, expect, it } from "vitest";
import {
  deleteContentCollection,
  getContentCollection
} from "../../../src/usecase/contentCollection";
import {
  createRepositoryWithCollection,
  TestContentCollectionRepository
} from "../helpers/contentCollectionUsecase";

class DeleteFailedContentCollectionRepository extends TestContentCollectionRepository {
  async delete(): Promise<never> {
    throw new Error("Failed to delete content collection");
  }
}

describe("deleteContentCollection", () => {
  it("コンテンツコレクションを削除する", async () => {
    const contentCollectionRepository =
      await createRepositoryWithCollection();

    await expect(
      deleteContentCollection("collection-1", contentCollectionRepository)
    ).resolves.toEqual({
      deleted: true,
      id: "collection-1"
    });
    await expect(
      getContentCollection("collection-1", contentCollectionRepository)
    ).rejects.toThrow("Content collection not found");
  });

  it("存在しないidはNotFoundにする", async () => {
    const contentCollectionRepository = new TestContentCollectionRepository();

    await expect(
      deleteContentCollection("missing", contentCollectionRepository)
    ).rejects.toThrow("Content collection not found");
  });

  it("削除に失敗した場合はエラーにする", async () => {
    const contentCollectionRepository =
      await createRepositoryWithCollection();
    const failedRepository = new DeleteFailedContentCollectionRepository();
    const collection = await contentCollectionRepository.findById(
      "collection-1"
    );

    if (collection) {
      await failedRepository.save(collection);
    }

    await expect(
      deleteContentCollection("collection-1", failedRepository)
    ).rejects.toMatchObject({
      message: "Failed to delete content collection",
      statusCode: 500
    });
  });
});
