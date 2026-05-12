import { Hono } from "hono";
import type { createPreviewController } from "../controllers";

export function createPreviewRouter(
  controller: ReturnType<typeof createPreviewController>
) {
  const router = new Hono();

  router.get("/:slug", controller.get);

  return router;
}
