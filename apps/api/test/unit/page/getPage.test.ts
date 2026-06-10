import { describe, expect, it } from "vitest";
import { getPage } from "../../../src/usecase/page";
import {
  createRepositoryWithPage,
  TestPageRepository
} from "../helpers/pageUsecase";

describe("getPage", () => {
  it("idでページを取得できる", async () => {
    const { pageRepository } = await createRepositoryWithPage();

    await expect(getPage(pageRepository, "page-1")).resolves.toMatchObject({
      id: "page-1"
    });
  });

  it("存在しないページはNotFoundにする", async () => {
    const pageRepository = new TestPageRepository();

    await expect(getPage(pageRepository, "missing")).rejects.toThrow(
      "Page not found"
    );
  });
});
