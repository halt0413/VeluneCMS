import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { CreateAppDependencies } from "./app/types";
import {
  createAuthController,
  createContentCollectionsController,
  createContentsController,
  createGitHubController,
  createPreviewController,
  createSystemController,
  createWebhookController
} from "./presentation/controllers";
import { AppError } from "./lib/errors/AppError";
import { createAuthMiddleware } from "./middleware/auth";
import {
  createAuthRouter,
  createContentCollectionsRouter,
  createContentsRouter,
  createGitHubRouter,
  createPreviewRouter,
  createSystemRouter,
  createWebhookRouter
} from "./presentation/routes";

export function createApp({
  adminApiToken,
  addIssueLabels,
  completeGitHubLogin,
  cookieSecure,
  createContentCollection,
  createContent,
  createIssue,
  deleteContent,
  getContent,
  getContentPreviewById,
  getCurrentUser,
  getIssue,
  getPagePreviewBySlug,
  githubWebhookSecret,
  listContents,
  listContentCollections,
  listIssues,
  logout,
  sessionCookieName,
  sessionRepository,
  startGitHubLogin,
  updateContent,
  updateIssue,
  webOrigin
}: CreateAppDependencies) {
  const app = new Hono();
  const auth = createAuthMiddleware({
    adminApiToken,
    sessionCookieName,
    sessionRepository
  });
  const authController = createAuthController({
    completeGitHubLogin,
    cookieSecure,
    logout,
    sessionCookieName,
    startGitHubLogin
  });
  const contentsController = createContentsController({
    createContent,
    deleteContent,
    getContent,
    getContentPreviewById,
    listContents,
    updateContent
  });
  const contentCollectionsController = createContentCollectionsController({
    createContentCollection,
    listContentCollections
  });
  const gitHubController = createGitHubController({
    addIssueLabels,
    createIssue,
    getIssue,
    listIssues,
    updateIssue
  });
  const previewController = createPreviewController({
    getPagePreviewBySlug
  });
  const systemController = createSystemController({
    getCurrentUser,
    sessionCookieName
  });

  app.use(
    "*",
    cors({
      origin: webOrigin,
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
      credentials: true
    })
  );

  app.onError((error, c) => {
    if (error.name === "ZodError") {
      return c.json({ error: "Invalid request body" }, 400);
    }

    if (error instanceof AppError) {
      return c.json(
        { error: error.message },
        error.statusCode as ContentfulStatusCode
      );
    }

    console.error(error);
    return c.json({ error: "Internal Server Error" }, 500);
  });

  app.route(
    "/",
    createSystemRouter({
      controller: systemController
    })
  );
  app.route("/auth", createAuthRouter(authController));

  // previewと内部GitHub操作は管理トークンまたはログインセッションを要求する
  app.use("/preview/*", auth);
  app.use("/internal/github", auth);
  app.use("/internal/github/*", auth);

  app.route(
    "/contents",
    createContentsRouter({
      auth,
      controller: contentsController
    })
  );
  app.route(
    "/content-collections",
    createContentCollectionsRouter({
      auth,
      controller: contentCollectionsController
    })
  );
  app.route("/internal/github", createGitHubRouter(gitHubController));
  app.route("/preview", createPreviewRouter(previewController));

  if (githubWebhookSecret) {
    // secret未設定の環境ではwebhook endpoint自体を公開しない
    app.route(
      "/webhooks/github",
      createWebhookRouter(
        createWebhookController({
          secret: githubWebhookSecret
        })
      )
    );
  }

  return app;
}
