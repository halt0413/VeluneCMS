import { Hono } from "hono";
import type { MiddlewareHandler } from "hono";
import type {
  createAuthController,
  createContentsController,
  createGitHubController,
  createPagesController,
  createPreviewController,
  createSystemController,
  createWebhookController
} from "./controllers";

export function createAuthRouter(
  controller: ReturnType<typeof createAuthController>
) {
  const router = new Hono();

  router.get("/github/login", controller.login);
  router.get("/github/callback", controller.callback);
  router.post("/logout", controller.logout);

  return router;
}

export function createContentsRouter({
  auth,
  controller
}: {
  auth: MiddlewareHandler;
  controller: ReturnType<typeof createContentsController>;
}) {
  const router = new Hono();

  router.get("/", controller.list);
  router.get("/:id", controller.get);
  router.get("/:id/preview", auth, controller.preview);
  router.post("/", auth, controller.create);
  router.patch("/:id", auth, controller.update);
  router.delete("/:id", auth, controller.remove);

  return router;
}

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

export function createPreviewRouter(
  controller: ReturnType<typeof createPreviewController>
) {
  const router = new Hono();

  router.get("/:slug", controller.get);

  return router;
}

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

export function createWebhookRouter(
  controller: ReturnType<typeof createWebhookController>
) {
  const router = new Hono();

  router.post("/", controller.receive);

  return router;
}
