import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { loadEnvFile } from "node:process";

loadNearestEnvFile();

export const cliTestApiBaseUrl = requireAnyEnv([
  "CLI_TEST_API_BASE_URL",
  "VELUNE_API_URL",
  "API_URL"
]);
export const cliTestCmsApiUrl = requireAnyEnv([
  "CLI_TEST_CMS_API_URL",
  "VELUNE_API_URL",
  "API_URL"
]);

export function joinCliTestUrl(path: string): string {
  const normalizedBase = cliTestApiBaseUrl.endsWith("/")
    ? cliTestApiBaseUrl
    : `${cliTestApiBaseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase).toString();
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
