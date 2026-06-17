import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { loadEnvFile } from "node:process";

loadNearestEnvFile();

export const cmsTestApiBaseUrl = requireAnyEnv([
  "CMS_TEST_API_BASE_URL",
  "CMS_API_BASE_URL",
  "API_URL"
]);
export const cmsTestApiBasePathUrl =
  process.env.CMS_TEST_API_BASE_PATH_URL ?? `${cmsTestApiBaseUrl}/api`;

export function joinCmsTestApiUrl(path: string): URL {
  const normalizedBase = cmsTestApiBasePathUrl.endsWith("/")
    ? cmsTestApiBasePathUrl
    : `${cmsTestApiBasePathUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase);
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
