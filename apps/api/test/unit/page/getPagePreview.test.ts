import { describe, expect, it } from "vitest";
import { getPagePreview } from "../../../src/usecase/page";
import {
  createRepositoryWithPage,
  TestPageRepository
} from "../helpers/pageUsecase";

class FindBySlugFailedPageRepository extends TestPageRepository {
  async findBySlug(): Promise<never> {
    throw new Error("Failed to find page by slug");
  }
}

describe("getPagePreview", () => {
  it("slugでページを取得できる", async () => {
    const { pageRepository } = await createRepositoryWithPage();

    await expect(getPagePreview(pageRepository, "my-page")).resolves.toMatchObject(
      {
        id: "page-1"
      }
    );
  });

  it("slugの取得に失敗した場合はエラーにする", async () => {
    const pageRepository = new FindBySlugFailedPageRepository();

    await expect(getPagePreview(pageRepository, "my-page")).rejects.toMatchObject({
      message: "Failed to get page preview",
      statusCode: 500
    });
  });

  it("slugに一致するページがなければNotFoundにする", async () => {
    const pageRepository = new TestPageRepository();

    await expect(getPagePreview(pageRepository, "missing")).rejects.toThrow(
      "Page not found"
    );
  });
});
