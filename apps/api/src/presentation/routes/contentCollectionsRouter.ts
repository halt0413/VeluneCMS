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
  router.get("/:id", auth, controller.get);
  router.post("/", auth, controller.create);
  router.patch("/:id", auth, controller.update);
  router.delete("/:id", auth, controller.remove);

  return router;
}
