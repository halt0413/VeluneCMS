import { describe, expect, it } from "vitest";
import {
  createAuthHeaders,
  createContentPayload,
  createIntegrationApi,
  createIntegrationUser,
  createSessionCookie
} from "./helpers/apiApp";
import { apiTestProfileUrl } from "../helpers/testEnv";

describe("contents routes integration", () => {
  it("Bearer認証でcontentを作成、更新、preview、削除できる", async () => {
    const { app } = createIntegrationApi();

    const createResponse = await app.request("/contents", {
      body: JSON.stringify(createContentPayload()),
      headers: {
        ...createAuthHeaders(),
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    const createdBody = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createdBody).toMatchObject({
      created: {
        id: "generated-1",
        slug: "example-page",
        status: "draft",
        title: "Example Page"
      }
    });

    const updateResponse = await app.request("/contents/generated-1", {
      body: JSON.stringify({
        status: "published",
        title: "Updated Page"
      }),
      headers: {
        ...createAuthHeaders(),
        "Content-Type": "application/json"
      },
      method: "PATCH"
    });
    const updatedBody = await updateResponse.json();

    expect(updateResponse.status).toBe(200);
    expect(updatedBody).toMatchObject({
      updated: {
        id: "generated-1",
        publishedAt: "2026-01-01T00:00:00.000Z",
        status: "published",
        title: "Updated Page"
      }
    });

    const previewResponse = await app.request("/contents/generated-1/preview", {
      headers: createAuthHeaders()
    });
    const previewBody = await previewResponse.json();

    expect(previewResponse.status).toBe(200);
    expect(previewBody).toEqual({
      content: {
        body: "本文",
        slug: "example-page",
        title: "Updated Page"
      },
      slug: "example-page",
      status: "preview"
    });

    const deleteResponse = await app.request("/contents/generated-1", {
      headers: createAuthHeaders(),
      method: "DELETE"
    });

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({
      deleted: true,
      id: "generated-1"
    });
  });

  it("未認証ではcontentを作成できない", async () => {
    const { app } = createIntegrationApi();

    const response = await app.request("/contents", {
      body: JSON.stringify(createContentPayload()),
      headers: {
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized"
    });
  });

  it("不正なbodyは400を返す", async () => {
    const { app } = createIntegrationApi();

    const response = await app.request("/contents", {
      body: JSON.stringify({
        body: "本文"
      }),
      headers: {
        ...createAuthHeaders(),
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid request body"
    });
  });

  it("sessionユーザーのcontentだけ一覧で返す", async () => {
    const { app, createSession } = createIntegrationApi();
    const firstUserSession = createSession(createIntegrationUser());
    const secondUserSession = createSession(
      createIntegrationUser({
        id: 2,
        login: "another-example-user",
        profileUrl: apiTestProfileUrl("another-example-user")
      })
    );

    await app.request("/contents", {
      body: JSON.stringify(createContentPayload({ slug: "first-page" })),
      headers: {
        "Content-Type": "application/json",
        Cookie: createSessionCookie(firstUserSession.id)
      },
      method: "POST"
    });
    await app.request("/contents", {
      body: JSON.stringify(createContentPayload({ slug: "second-page" })),
      headers: {
        "Content-Type": "application/json",
        Cookie: createSessionCookie(secondUserSession.id)
      },
      method: "POST"
    });

    const response = await app.request("/contents", {
      headers: {
        Cookie: createSessionCookie(firstUserSession.id)
      }
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body).toMatchObject({
      total: 1
    });
    expect(body.items).toEqual([
      expect.objectContaining({
        owner: {
          id: 1,
          login: "example-user"
        },
        slug: "first-page"
      })
    ]);
  });
});
