import { describe, expect, it } from "vitest";
import { createIntegrationApi, integrationCmsOrigin } from "./helpers/apiApp";

describe("CORS integration", () => {
  it("PATCHとDELETEのpreflightを許可する", async () => {
    const { app } = createIntegrationApi();

    const patchResponse = await app.request("/contents/generated-1", {
      headers: {
        "Access-Control-Request-Method": "PATCH",
        Origin: integrationCmsOrigin
      },
      method: "OPTIONS"
    });
    const deleteResponse = await app.request("/contents/generated-1", {
      headers: {
        "Access-Control-Request-Method": "DELETE",
        Origin: integrationCmsOrigin
      },
      method: "OPTIONS"
    });

    expect(patchResponse.headers.get("access-control-allow-methods")).toContain(
      "PATCH"
    );
    expect(deleteResponse.headers.get("access-control-allow-methods")).toContain(
      "DELETE"
    );
  });
});
