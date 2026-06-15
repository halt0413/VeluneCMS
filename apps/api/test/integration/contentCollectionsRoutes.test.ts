import { describe, expect, it } from "vitest";
import {
  createAuthHeaders,
  createCollectionPayload,
  createIntegrationApi
} from "./helpers/apiApp";

describe("content collections routes integration", () => {
  it("collectionを作成、一覧取得、更新、削除できる", async () => {
    const { app } = createIntegrationApi();

    const createResponse = await app.request("/content-collections", {
      body: JSON.stringify(createCollectionPayload()),
      headers: {
        ...createAuthHeaders(),
        "Content-Type": "application/json"
      },
      method: "POST"
    });
    const createdBody = await createResponse.json();

    expect(createResponse.status).toBe(201);
    expect(createdBody).toEqual({
      created: {
        createdAt: "2026-01-01T00:00:00.000Z",
        id: "generated-1",
        name: "Example Collection",
        slug: "example-collection",
        updatedAt: "2026-01-01T00:00:00.000Z"
      }
    });

    const listResponse = await app.request("/content-collections");
    const listBody = await listResponse.json();

    expect(listResponse.status).toBe(200);
    expect(listBody).toMatchObject({
      total: 2
    });
    expect(listBody.items).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          createdAt: "2026-01-01T00:00:00.000Z",
          id: "generated-1",
          name: "Example Collection",
          slug: "example-collection",
          updatedAt: "2026-01-01T00:00:00.000Z"
        })
      ])
    );

    const updateResponse = await app.request(
      "/content-collections/generated-1",
      {
        body: JSON.stringify({
          name: "Updated Collection"
        }),
        headers: {
          ...createAuthHeaders(),
          "Content-Type": "application/json"
        },
        method: "PATCH"
      }
    );

    expect(updateResponse.status).toBe(200);
    await expect(updateResponse.json()).resolves.toMatchObject({
      updated: {
        id: "generated-1",
        name: "Updated Collection"
      }
    });

    const deleteResponse = await app.request(
      "/content-collections/generated-1",
      {
        headers: createAuthHeaders(),
        method: "DELETE"
      }
    );

    expect(deleteResponse.status).toBe(200);
    await expect(deleteResponse.json()).resolves.toEqual({
      deleted: true,
      id: "generated-1"
    });
  });

  it("未認証ではcollectionを作成できない", async () => {
    const { app } = createIntegrationApi();

    const response = await app.request("/content-collections", {
      body: JSON.stringify(createCollectionPayload()),
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

    const response = await app.request("/content-collections", {
      body: JSON.stringify({
        name: ""
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
});
