import { describe, expect, it } from "vitest";
import { getPagePreviewById } from "../../../src/usecase/page";
import {
  createRepositoryWithPage,
  TestPageRepository
} from "../helpers/pageUsecase";

class FindByIdFailedPageRepository extends TestPageRepository {
  async findById(): Promise<never> {
    throw new Error("Failed to find page by id");
  }
}

describe("getPagePreviewById", () => {
  it("idでpreview用ページを取得できる", async () => {
    const { pageRepository } = await createRepositoryWithPage();

    await expect(
      getPagePreviewById(pageRepository, "page-1")
    ).resolves.toMatchObject({
      id: "page-1"
    });
  });

  it("idの取得に失敗した場合はエラーにする", async () => {
    const pageRepository = new FindByIdFailedPageRepository();

    await expect(
      getPagePreviewById(pageRepository, "page-1")
    ).rejects.toMatchObject({
      message: "Failed to get page preview",
      statusCode: 500
    });
  });

  it("idに一致するページがなければNotFoundにする", async () => {
    const pageRepository = new TestPageRepository();

    await expect(getPagePreviewById(pageRepository, "missing")).rejects.toThrow(
      "Page not found"
    );
  });
});
