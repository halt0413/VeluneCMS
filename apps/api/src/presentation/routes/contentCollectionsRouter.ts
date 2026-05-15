import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { createContentCollectionsController } from "../controllers";

export function createContentCollectionsRouter({
  auth,
  controller
}: {
  auth: MiddlewareHandler;
  controller: ReturnType<typeof createContentCollectionsController>;
}) {
  const router = new Hono();

  router.get("/", controller.list);
  router.post("/", auth, controller.create);

  return router;
}
