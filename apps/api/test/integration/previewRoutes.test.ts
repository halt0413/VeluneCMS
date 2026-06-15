import { describe, expect, it } from "vitest";
import {
  createAuthHeaders,
  createContentPayload,
  createIntegrationApi
} from "./helpers/apiApp";

describe("preview routes integration", () => {
  it("Bearer認証でslugからpreviewを取得できる", async () => {
    const { app } = createIntegrationApi();

    await app.request("/contents", {
      body: JSON.stringify(
        createContentPayload({
          status: "published"
        })
      ),
      headers: {
        ...createAuthHeaders(),
        "Content-Type": "application/json"
      },
      method: "POST"
    });

    const response = await app.request("/preview/example-page", {
      headers: createAuthHeaders()
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      content: {
        body: "本文",
        slug: "example-page",
        title: "Example Page"
      },
      slug: "example-page",
      status: "preview"
    });
  });

  it("未認証ではpreviewを取得できない", async () => {
    const { app } = createIntegrationApi();

    const response = await app.request("/preview/example-page");

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Unauthorized"
    });
  });
});
