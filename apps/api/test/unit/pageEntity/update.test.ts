import { describe, expect, it } from "vitest";
import { Page } from "../../../src/domain";
import { createAuthUser, createPageInput } from "../helpers/pageUsecase";

describe("Page.update", () => {
  it("ページ内容を更新して更新者を差し替える", () => {
    const owner = createAuthUser();
    const editor = createAuthUser({
      id: 2,
      login: "editor",
      profileUrl: "https://example.com/editor"
    });
    const page = Page.create({
      actor: owner,
      id: "page-1",
      input: createPageInput(),
      now: "2026-01-01T00:00:00.000Z"
    });

    page.update(
      {
        body: " 更新本文 ",
        slug: " updated_page ",
        title: " 更新タイトル "
      },
      "2026-01-02T00:00:00.000Z",
      editor
    );

    expect(page.toSnapshot()).toMatchObject({
      body: "更新本文",
      owner: {
        id: owner.id,
        login: owner.login
      },
      slug: "updated-page",
      title: "更新タイトル",
      updatedAt: "2026-01-02T00:00:00.000Z",
      updatedBy: {
        id: editor.id,
        login: editor.login
      }
    });
  });

  it("初回公開時だけpublishedAtを入れる", () => {
    const page = Page.create({
      id: "page-1",
      input: createPageInput({ status: "draft" }),
      now: "2026-01-01T00:00:00.000Z"
    });

    page.update({ status: "published" }, "2026-01-02T00:00:00.000Z");
    page.update({ title: "更新" }, "2026-01-03T00:00:00.000Z");

    expect(page.toSnapshot()).toMatchObject({
      publishedAt: "2026-01-02T00:00:00.000Z",
      status: "published",
      updatedAt: "2026-01-03T00:00:00.000Z"
    });
  });

  it("下書きに戻した場合はpublishedAtを消す", () => {
    const page = Page.create({
      id: "page-1",
      input: createPageInput({ status: "published" }),
      now: "2026-01-01T00:00:00.000Z"
    });

    page.update({ status: "draft" }, "2026-01-02T00:00:00.000Z");

    expect(page.toSnapshot()).toEqual(
      expect.not.objectContaining({
        publishedAt: expect.any(String)
      })
    );
    expect(page.toSnapshot()).toMatchObject({
      status: "draft"
    });
  });
});
