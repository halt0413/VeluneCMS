import { describe, expect, it } from "vitest";
import { createContentCollection } from "../../../src/usecase/contentCollection";
import {
  createCollectionDependencies,
  createCollectionInput,
  TestContentCollectionRepository
} from "../helpers/contentCollectionUsecase";

class SaveFailedContentCollectionRepository extends TestContentCollectionRepository {
  async save(): Promise<never> {
    throw new Error("Failed to save content collection");
  }
}

describe("createContentCollection", () => {
  it("コンテンツコレクションを作成する", async () => {
    const contentCollectionRepository = new TestContentCollectionRepository();

    await expect(
      createContentCollection(
        createCollectionInput(),
        createCollectionDependencies(contentCollectionRepository)
      )
    ).resolves.toEqual({
      createdAt: "2026-01-01T00:00:00.000Z",
      id: "collection-1",
      name: "Portfolio",
      slug: "my-portfolio",
      updatedAt: "2026-01-01T00:00:00.000Z"
    });
  });

  it("作成に失敗した場合はエラーにする", async () => {
    const contentCollectionRepository =
      new SaveFailedContentCollectionRepository();

    await expect(
      createContentCollection(
        createCollectionInput(),
        createCollectionDependencies(contentCollectionRepository)
      )
    ).rejects.toMatchObject({
      message: "Failed to create content collection",
      statusCode: 500
    });
  });
});
