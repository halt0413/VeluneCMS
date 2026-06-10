import { describe, expect, it } from "vitest";
import { createPage } from "../../../src/usecase/page";
import {
  createAuthUser,
  createPageDependencies,
  createPageInput,
  TestPageRepository
} from "../helpers/pageUsecase";

class SaveFailedPageRepository extends TestPageRepository {
  async save(): Promise<never> {
    throw new Error("Failed to save page");
  }
}

describe("createPage", () => {
  it("ページを作成してownerと作成者を紐付ける", async () => {
    const actor = createAuthUser();
    const pageRepository = new TestPageRepository();

    await expect(
      createPage(createPageInput(), createPageDependencies(pageRepository), actor)
    ).resolves.toMatchObject({
      createdBy: {
        id: actor.id,
        login: actor.login
      },
      id: "page-1",
      owner: {
        id: actor.id,
        login: actor.login
      },
      slug: "my-page",
      status: "draft",
      updatedBy: {
        id: actor.id,
        login: actor.login
      }
    });
  });

  it("公開ページ作成時はpublishedAtを入れる", async () => {
    const actor = createAuthUser();
    const pageRepository = new TestPageRepository();

    await expect(
      createPage(
        createPageInput({
          status: "published"
        }),
        createPageDependencies(pageRepository),
        actor
      )
    ).resolves.toMatchObject({
      publishedAt: "2026-01-01T00:00:00.000Z",
      status: "published"
    });
  });

  it("作成に失敗した場合はエラーにする", async () => {
    const actor = createAuthUser();
    const pageRepository = new SaveFailedPageRepository();

    await expect(
      createPage(createPageInput(), createPageDependencies(pageRepository), actor)
    ).rejects.toMatchObject({
      message: "Failed to create page",
      statusCode: 500
    });
  });
});
