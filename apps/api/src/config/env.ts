import { ConfigurationError } from "../lib/errors/AppError";

export type ApiEnv = {
  apiUrl: string;
  adminApiToken: string;
  cmsUrl: string;
  githubOAuth: {
    accessTokenUrl: string;
    authorizeUrl: string;
    clientId?: string;
    clientSecret?: string;
    redirectUri: string;
    scope: string;
    stateTtlSeconds: number;
    userUrl: string;
  };
  port: number;
  session: {
    cookieName: string;
    cookieSecure: boolean;
  };
};

export type ApiEnvSource = Record<string, string | undefined>;

export function getApiEnv(env: ApiEnvSource = process.env): ApiEnv {
  const port = requirePositiveIntegerEnv(env, "PORT");
  const apiUrl = requireEnv(env, "API_URL");
  const cmsUrl = requireEnv(env, "CMS_URL");
  const sessionCookieName = requireEnv(env, "SESSION_COOKIE_NAME");
  const githubOauthCallbackPath = requireEnv(env, "GITHUB_OAUTH_CALLBACK_PATH");

  return {
    apiUrl,
    adminApiToken: requireEnv(env, "ADMIN_API_TOKEN"),
    cmsUrl,
    githubOAuth: {
      accessTokenUrl: requireEnv(env, "GITHUB_OAUTH_ACCESS_TOKEN_URL"),
      authorizeUrl: requireEnv(env, "GITHUB_OAUTH_AUTHORIZE_URL"),
      clientId: env.GITHUB_OAUTH_CLIENT_ID,
      clientSecret: env.GITHUB_OAUTH_CLIENT_SECRET,
      redirectUri:
        env.GITHUB_OAUTH_REDIRECT_URI ??
        new URL(githubOauthCallbackPath, apiUrl).toString(),
      scope: requireEnv(env, "GITHUB_OAUTH_SCOPE"),
      stateTtlSeconds: requirePositiveIntegerEnv(
        env,
        "GITHUB_OAUTH_STATE_TTL_SECONDS"
      ),
      userUrl: requireEnv(env, "GITHUB_OAUTH_USER_URL")
    },
    port,
    session: {
      cookieName: sessionCookieName,
      cookieSecure: env.NODE_ENV === "production"
    }
  };
}

function requireEnv(env: ApiEnvSource, name: string): string {
  const value = env[name];

  if (!value) {
    throw new ConfigurationError(`${name} is required`);
  }

  return value;
}

function requirePositiveIntegerEnv(
  env: ApiEnvSource,
  name: string
): number {
  const value = Number.parseInt(requireEnv(env, name), 10);

  if (!Number.isInteger(value) || value <= 0) {
    throw new ConfigurationError(`${name} must be a positive integer`);
  }

  return value;
}
