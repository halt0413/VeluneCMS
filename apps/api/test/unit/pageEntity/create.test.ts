import { describe, expect, it } from "vitest";
import { Page } from "../../../src/domain";
import { createAuthUser, createPageInput } from "../helpers/pageUsecase";

describe("Page.create", () => {
  it("入力を正規化してページを作成する", () => {
    const actor = createAuthUser();
    const page = Page.create({
      actor,
      id: "page-1",
      input: createPageInput({
        body: " 本文 ",
        slug: " my_page ",
        title: " タイトル "
      }),
      now: "2026-01-01T00:00:00.000Z"
    });

    expect(page.toSnapshot()).toMatchObject({
      body: "本文",
      createdBy: {
        id: actor.id,
        login: actor.login
      },
      owner: {
        id: actor.id,
        login: actor.login
      },
      slug: "my-page",
      title: "タイトル",
      updatedBy: {
        id: actor.id,
        login: actor.login
      }
    });
  });

  it("公開状態で作成した場合はpublishedAtを入れる", () => {
    const page = Page.create({
      id: "page-1",
      input: createPageInput({ status: "published" }),
      now: "2026-01-01T00:00:00.000Z"
    });

    expect(page.toSnapshot()).toMatchObject({
      publishedAt: "2026-01-01T00:00:00.000Z",
      status: "published"
    });
  });

  it("必須文字列が空ならエラーにする", () => {
    expect(() =>
      Page.create({
        id: "page-1",
        input: createPageInput({ title: " " }),
        now: "2026-01-01T00:00:00.000Z"
      })
    ).toThrow("Title is required");
  });
});
