import type { Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { AuthControllerHandlers } from "../types";

type CreateAuthControllerDependencies = AuthControllerHandlers & {
  cookieSecure: boolean;
  sessionCookieName: string;
};

export function createAuthController({
  completeGitHubLogin,
  cookieSecure,
  logout,
  sessionCookieName,
  startGitHubLogin
}: CreateAuthControllerDependencies) {
  return {
    login(c: Context) {
      const { authorizationUrl } = startGitHubLogin(c.req.query("redirectTo"));
      return c.redirect(authorizationUrl, 302);
    },
    async callback(c: Context) {
      const result = await completeGitHubLogin({
        code: c.req.query("code"),
        state: c.req.query("state")
      });

      setCookie(c, sessionCookieName, result.sessionId, {
        httpOnly: true,
        path: "/",
        sameSite: "Lax",
        secure: cookieSecure
      });

      return c.redirect(result.redirectUrl, 302);
    },
    logout(c: Context) {
      const response = logout(getCookie(c, sessionCookieName));

      deleteCookie(c, sessionCookieName, {
        path: "/"
      });

      return c.json(response);
    }
  };
}
