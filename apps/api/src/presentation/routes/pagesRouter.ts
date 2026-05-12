import { Hono } from "hono";
import type { createPagesController } from "../controllers";

export function createPagesRouter(
  controller: ReturnType<typeof createPagesController>
) {
  const router = new Hono();

  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.post("/", controller.create);
  router.get("/:id/preview", controller.preview);
  router.post("/:id/sync/github", controller.syncGitHub);

  return router;
}
