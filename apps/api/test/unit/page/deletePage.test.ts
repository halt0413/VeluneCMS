import { describe, expect, it } from "vitest";
import { deletePage, getPage } from "../../../src/usecase/page";
import {
  createRepositoryWithPage,
  TestPageRepository
} from "../helpers/pageUsecase";

class DeleteFailedPageRepository extends TestPageRepository {
  async delete(): Promise<never> {
    throw new Error("Failed to delete page");
  }
}

describe("deletePage", () => {
  it("ページを削除する", async () => {
    const { actor, pageRepository } = await createRepositoryWithPage();

    await expect(deletePage(pageRepository, "page-1", actor)).resolves.toEqual({
      deleted: true,
      id: "page-1"
    });
    await expect(getPage(pageRepository, "page-1")).rejects.toThrow(
      "Page not found"
    );
  });

  it("削除に失敗した場合はエラーにする", async () => {
    const { actor, pageRepository } = await createRepositoryWithPage();
    const failedRepository = new DeleteFailedPageRepository();
    const page = await pageRepository.findById("page-1");

    if (page) {
      await failedRepository.save(page);
    }

    await expect(
      deletePage(failedRepository, "page-1", actor)
    ).rejects.toMatchObject({
      message: "Failed to delete page",
      statusCode: 500
    });
  });
});
