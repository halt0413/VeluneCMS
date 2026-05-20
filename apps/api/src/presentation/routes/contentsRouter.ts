import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type { createContentsController } from "../controllers";

export function createContentsRouter({
  auth,
  controller
}: {
  auth: MiddlewareHandler;
  controller: ReturnType<typeof createContentsController>;
}) {
  const router = new Hono();

  router.get("/", auth, controller.list);
  router.get("/:id", auth, controller.get);
  router.get("/:id/preview", auth, controller.preview);
  router.post("/", auth, controller.create);
  router.patch("/:id", auth, controller.update);
  router.delete("/:id", auth, controller.remove);

  return router;
}
