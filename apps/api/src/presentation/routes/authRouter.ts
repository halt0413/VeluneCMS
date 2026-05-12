import { Hono } from "hono";
import type { createAuthController } from "../controllers";

export function createAuthRouter(
  controller: ReturnType<typeof createAuthController>
) {
  const router = new Hono();

  router.get("/github/login", controller.login);
  router.get("/github/callback", controller.callback);
  router.post("/logout", controller.logout);

  return router;
}
