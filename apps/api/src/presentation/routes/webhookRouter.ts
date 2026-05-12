import { Hono } from "hono";
import type { createWebhookController } from "../controllers";

export function createWebhookRouter(
  controller: ReturnType<typeof createWebhookController>
) {
  const router = new Hono();

  router.post("/", controller.receive);

  return router;
}
