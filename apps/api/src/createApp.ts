import { Hono } from "hono";
import { cors } from "hono/cors";
import type { ContentfulStatusCode } from "hono/utils/http-status";
import type { CreateAppDependencies } from "./app/types";
import {
  createAuthController,
  createContentCollectionsController,
  createContentsController,
  createPreviewController,
  createSystemController
} from "./presentation/controllers";
import { AppError } from "./lib/errors/AppError";
import { createAuthMiddleware } from "./middleware/auth";
import {
  createAuthRouter,
  createContentCollectionsRouter,
  createContentsRouter,
  createPreviewRouter,
  createSystemRouter
} from "./presentation/routes";

export function createApp({
  adminApiToken,
  completeGitHubLogin,
  cookieSecure,
  createContentCollection,
  createContent,
  deleteContentCollection,
  deleteContent,
  getContent,
  getContentCollection,
  getContentPreviewById,
  getCurrentUser,
  getPagePreviewBySlug,
  listContents,
  listContentCollections,
  logout,
  sessionCookieName,
  sessionRepository,
  startGitHubLogin,
  updateContent,
  updateContentCollection,
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
    getCurrentUser,
    getContent,
    getContentPreviewById,
    listContents,
    sessionCookieName,
    updateContent
  });
  const contentCollectionsController = createContentCollectionsController({
    createContentCollection,
    deleteContentCollection,
    getContentCollection,
    updateContentCollection,
    listContentCollections
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
      // 管理画面のCRUDはpreflight対象なので、実装済みmethodをここにも必ず反映する
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

  // previewは管理トークンまたはログインセッションを要求する
  app.use("/preview/*", auth);

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
  app.route("/preview", createPreviewRouter(previewController));

  return app;
}
