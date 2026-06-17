import { describe, expect, it } from "vitest";
import { UnauthorizedError } from "../../src/lib/errors/AppError";
import { apiTestGitHubAuthorizeUrlWithRedirect } from "../helpers/testEnv";
import {
  createIntegrationApi,
  createIntegrationUser,
  createSessionCookie,
  integrationContentListUrl,
  integrationSessionCookieName,
  integrationSessionIdFromCallback
} from "./helpers/apiApp";

describe("auth routes integration", () => {
  it("GitHub loginは認可URLへredirectする", async () => {
    const { app } = createIntegrationApi({
      startGitHubLogin: (redirectTo) => ({
        authorizationUrl: apiTestGitHubAuthorizeUrlWithRedirect(redirectTo ?? "")
      })
    });

    const response = await app.request(
      "/auth/github/login?redirectTo=/contents"
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      apiTestGitHubAuthorizeUrlWithRedirect("/contents")
    );
  });

  it("GitHub callbackはsession cookieを付与してredirectする", async () => {
    const { app } = createIntegrationApi({
      completeGitHubLogin: async (input) => {
        expect(input).toEqual({
          code: "github-code",
          state: "oauth-state"
        });

        return {
          redirectUrl: integrationContentListUrl,
          sessionId: integrationSessionIdFromCallback,
          user: createIntegrationUser()
        };
      }
    });

    const response = await app.request(
      "/auth/github/callback?code=github-code&state=oauth-state"
    );

    expect(response.status).toBe(302);
    expect(response.headers.get("location")).toBe(
      integrationContentListUrl
    );
    expect(response.headers.get("set-cookie")).toContain(
      `${integrationSessionCookieName}=${integrationSessionIdFromCallback}`
    );
  });

  it("GitHub callbackが失敗した場合は401を返す", async () => {
    const { app } = createIntegrationApi({
      completeGitHubLogin: async () => {
        throw new UnauthorizedError("Invalid OAuth state");
      }
    });

    const response = await app.request(
      "/auth/github/callback?code=github-code&state=invalid-state"
    );

    expect(response.status).toBe(401);
    await expect(response.json()).resolves.toEqual({
      error: "Invalid OAuth state"
    });
  });

  it("logoutはsession cookieを削除する", async () => {
    const { app, createSession } = createIntegrationApi();
    const session = createSession();

    const response = await app.request("/auth/logout", {
      headers: {
        Cookie: createSessionCookie(session.id)
      },
      method: "POST"
    });

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual({
      loggedOut: true
    });
    expect(response.headers.get("set-cookie")).toContain(
      `${integrationSessionCookieName}=`
    );
  });
});
