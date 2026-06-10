import { describe, expect, it } from "vitest";
import { listPages } from "../../../src/usecase/page";
import {
  createRepositoryWithPage,
  TestPageRepository
} from "../helpers/pageUsecase";

class ListFailedPageRepository extends TestPageRepository {
  async list(): Promise<never> {
    throw new Error("Failed to list pages");
  }
}

describe("listPages", () => {
  it("一覧を返す", async () => {
    const { pageRepository } = await createRepositoryWithPage();

    await expect(listPages(pageRepository)).resolves.toHaveLength(1);
  });

  it("一覧取得に失敗した場合はエラーにする", async () => {
    const pageRepository = new ListFailedPageRepository();

    await expect(listPages(pageRepository)).rejects.toMatchObject({
      message: "Failed to list pages",
      statusCode: 500
    });
  });
});
