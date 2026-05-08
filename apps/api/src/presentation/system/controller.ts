import type { MeResponse } from "@repo/types";
import type { Context } from "hono";
import { getCookie } from "hono/cookie";
import type { MeControllerHandler } from "../types";

type CreateSystemControllerDependencies = MeControllerHandler & {
  sessionCookieName: string;
};

export function createSystemController({
  getCurrentUser,
  sessionCookieName
}: CreateSystemControllerDependencies) {
  return {
    health(c: Context) {
      return c.json({
        name: "cms-api",
        status: "ok"
      });
    },
    me(c: Context) {
      const response: MeResponse = {
        user: getCurrentUser(getCookie(c, sessionCookieName))
      };

      return c.json(response);
    }
  };
}
