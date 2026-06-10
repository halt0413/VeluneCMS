import { describe, expect, it } from "vitest";
import { listContentCollections } from "../../../src/usecase/contentCollection";
import {
  createRepositoryWithCollection,
  TestContentCollectionRepository
} from "../helpers/contentCollectionUsecase";

class ListFailedContentCollectionRepository extends TestContentCollectionRepository {
  async list(): Promise<never> {
    throw new Error("Failed to list content collections");
  }
}

describe("listContentCollections", () => {
  it("一覧を取得する", async () => {
    const contentCollectionRepository =
      await createRepositoryWithCollection();

    await expect(
      listContentCollections(contentCollectionRepository)
    ).resolves.toHaveLength(1);
  });

  it("一覧取得に失敗した場合はエラーにする", async () => {
    const contentCollectionRepository =
      new ListFailedContentCollectionRepository();

    await expect(
      listContentCollections(contentCollectionRepository)
    ).rejects.toMatchObject({
      message: "Failed to list content collections",
      statusCode: 500
    });
  });
});
