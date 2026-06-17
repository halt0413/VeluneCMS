import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { loadEnvFile } from "node:process";

loadNearestEnvFile();

export const cmsE2eApiBaseUrl = requireEnv("CMS_API_BASE_URL");
export const cmsE2eUserBaseUrl =
  process.env.CMS_E2E_USER_BASE_URL ?? requireEnv("CMS_URL");

export function cmsE2eProfileUrl(login: string): string {
  return new URL(`/${login}`, cmsE2eUserBaseUrl).toString();
}

export function cmsE2eAvatarUrl(): string {
  return new URL("/avatar.png", cmsE2eUserBaseUrl).toString();
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

function requireEnv(name: string): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} is required`);
  }

  return value;
}
