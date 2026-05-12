import { Hono } from "hono";
import type { createSystemController } from "../controllers";

export function createSystemRouter({
  controller
}: {
  controller: ReturnType<typeof createSystemController>;
}) {
  const router = new Hono();

  router.get("/", controller.health);
  router.get("/me", controller.me);

  return router;
}
