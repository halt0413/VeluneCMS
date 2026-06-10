import { describe, expect, it } from "vitest";
import { updatePage } from "../../../src/usecase/page";
import {
  createAuthUser,
  createRepositoryWithPage
} from "../helpers/pageUsecase";

describe("updatePage", () => {
  it("ページを更新してupdatedByとupdatedAtを更新する", async () => {
    const { actor, pageRepository } = await createRepositoryWithPage();

    await expect(
      updatePage(
        "page-1",
        {
          slug: "updated page",
          status: "published",
          title: "更新タイトル"
        },
        {
          getNow: () => "2026-01-02T00:00:00.000Z",
          pageRepository
        },
        actor
      )
    ).resolves.toMatchObject({
      publishedAt: "2026-01-02T00:00:00.000Z",
      slug: "updated-page",
      status: "published",
      title: "更新タイトル",
      updatedAt: "2026-01-02T00:00:00.000Z",
      updatedBy: {
        id: actor.id,
        login: actor.login
      }
    });
  });

  it("owner以外が更新しようとするとNotFoundとして扱う", async () => {
    const { pageRepository } = await createRepositoryWithPage();
    const otherActor = createAuthUser({
      id: 2,
      login: "other",
      profileUrl: "https://example.com/other"
    });

    await expect(
      updatePage(
        "page-1",
        {
          title: "他人の更新"
        },
        {
          getNow: () => "2026-01-02T00:00:00.000Z",
          pageRepository
        },
        otherActor
      )
    ).rejects.toThrow("Page not found");
  });
});
