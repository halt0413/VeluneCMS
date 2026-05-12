import { Hono } from "hono";
import type { createGitHubController } from "../controllers";

export function createGitHubRouter(
  controller: ReturnType<typeof createGitHubController>
) {
  const router = new Hono();

  router.get("/issues", controller.list);
  router.get("/issues/:issueNumber", controller.get);
  router.post("/issues", controller.create);
  router.patch("/issues/:issueNumber", controller.update);
  router.post("/issues/:issueNumber/labels", controller.updateLabels);

  return router;
}
