import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { loadEnvFile } from "node:process";

loadNearestEnvFile();

export const apiTestCmsOrigin = requireAnyEnv([
  "API_TEST_CMS_ORIGIN",
  "CMS_URL"
]);
export const apiTestCmsAppBaseUrl =
  process.env.API_TEST_CMS_APP_BASE_URL ?? `${apiTestCmsOrigin}/app/`;
export const apiTestGitHubAuthorizeUrl = requireAnyEnv([
  "API_TEST_GITHUB_AUTHORIZE_URL",
  "GITHUB_OAUTH_AUTHORIZE_URL"
]);
export const apiTestUserBaseUrl =
  process.env.API_TEST_USER_BASE_URL ?? apiTestCmsOrigin;

export function apiTestContentListUrl(): string {
  return new URL("/contents", apiTestCmsOrigin).toString();
}

export function apiTestContentQueryUrl(): string {
  return new URL("contents?type=portfolio", apiTestCmsAppBaseUrl).toString();
}

export function apiTestProfileUrl(login: string): string {
  return new URL(`/${login}`, apiTestUserBaseUrl).toString();
}

export function apiTestAvatarUrl(): string {
  return new URL("/avatar.png", apiTestUserBaseUrl).toString();
}

export function apiTestGitHubAuthorizeUrlWithState(state: string): string {
  const url = new URL(apiTestGitHubAuthorizeUrl);
  url.searchParams.set("state", state);
  return url.toString();
}

export function apiTestGitHubAuthorizeUrlWithRedirect(
  redirectTo: string
): string {
  const url = new URL(apiTestGitHubAuthorizeUrl);
  url.searchParams.set("redirectTo", redirectTo);
  return url.toString();
}

function loadNearestEnvFile(): void {
  let currentDirectory = process.cwd();

  while (true) {
    const envPath = join(currentDirectory, ".env");

    if (existsSync(envPath)) {
      loadEnvFile(envPath);
      return;
    }

    const parentDirectory = dirname(currentDirectory);

    if (
      parentDirectory === currentDirectory ||
      currentDirectory === parse(currentDirectory).root
    ) {
      return;
    }

    currentDirectory = parentDirectory;
  }
}

function requireAnyEnv(names: string[]): string {
  for (const name of names) {
    const value = process.env[name];

    if (value) {
      return value;
    }
  }

  throw new Error(`${names.join(" or ")} is required`);
}
