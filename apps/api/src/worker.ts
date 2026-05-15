import { createApiApp } from "./app/createDependencies";
import { getApiEnv, type ApiEnvSource } from "./config/env";
import type { D1Database } from "./infrastructure/db/d1";
import { D1ContentCollectionRepository } from "./infrastructure/contentCollectionRepository";
import { D1PageRepository } from "./infrastructure/pageRepository";

type CloudflareBindings = {
  ADMIN_API_TOKEN: string;
  API_URL: string;
  CMS_URL: string;
  CONTENT_DB: D1Database;
  GITHUB_OAUTH_ACCESS_TOKEN_URL: string;
  GITHUB_OAUTH_AUTHORIZE_URL: string;
  GITHUB_OAUTH_CALLBACK_PATH: string;
  GITHUB_OAUTH_CLIENT_ID?: string;
  GITHUB_OAUTH_CLIENT_SECRET?: string;
  GITHUB_OAUTH_REDIRECT_URI?: string;
  GITHUB_OAUTH_SCOPE: string;
  GITHUB_OAUTH_STATE_TTL_SECONDS: string;
  GITHUB_OAUTH_USER_URL: string;
  GITHUB_OWNER?: string;
  GITHUB_REPO?: string;
  GITHUB_TOKEN?: string;
  GITHUB_WEBHOOK_SECRET?: string;
  SESSION_COOKIE_NAME: string;
};

type WorkerExecutionContext = {
  passThroughOnException(): void;
  props: unknown;
  waitUntil(promise: Promise<unknown>): void;
};

function toApiEnvSource(env: CloudflareBindings): ApiEnvSource {
  return {
    PORT: "8787",
    ADMIN_API_TOKEN: env.ADMIN_API_TOKEN,
    API_URL: env.API_URL,
    CMS_URL: env.CMS_URL,
    GITHUB_OAUTH_ACCESS_TOKEN_URL: env.GITHUB_OAUTH_ACCESS_TOKEN_URL,
    GITHUB_OAUTH_AUTHORIZE_URL: env.GITHUB_OAUTH_AUTHORIZE_URL,
    GITHUB_OAUTH_CALLBACK_PATH: env.GITHUB_OAUTH_CALLBACK_PATH,
    GITHUB_OAUTH_CLIENT_ID: env.GITHUB_OAUTH_CLIENT_ID,
    GITHUB_OAUTH_CLIENT_SECRET: env.GITHUB_OAUTH_CLIENT_SECRET,
    GITHUB_OAUTH_REDIRECT_URI: env.GITHUB_OAUTH_REDIRECT_URI,
    GITHUB_OAUTH_SCOPE: env.GITHUB_OAUTH_SCOPE,
    GITHUB_OAUTH_STATE_TTL_SECONDS: env.GITHUB_OAUTH_STATE_TTL_SECONDS,
    GITHUB_OAUTH_USER_URL: env.GITHUB_OAUTH_USER_URL,
    GITHUB_OWNER: env.GITHUB_OWNER,
    GITHUB_REPO: env.GITHUB_REPO,
    GITHUB_TOKEN: env.GITHUB_TOKEN,
    GITHUB_WEBHOOK_SECRET: env.GITHUB_WEBHOOK_SECRET,
    SESSION_COOKIE_NAME: env.SESSION_COOKIE_NAME
  };
}

export default {
  fetch(
    request: Request,
    env: CloudflareBindings,
    executionContext: WorkerExecutionContext
  ) {
    const app = createApiApp(getApiEnv(toApiEnvSource(env)), {
      createId: () => crypto.randomUUID(),
      getNow: () => new Date().toISOString(),
      contentCollectionRepository: new D1ContentCollectionRepository(env.CONTENT_DB),
      pageRepository: new D1PageRepository(env.CONTENT_DB)
    });

    return app.fetch(request, env, executionContext);
  }
};
