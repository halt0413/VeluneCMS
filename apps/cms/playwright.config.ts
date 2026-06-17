import { existsSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { loadEnvFile } from "node:process";
import { defineConfig, devices } from "@playwright/test";

loadNearestEnvFile();

const e2eBaseUrl = requireEnv("CMS_E2E_BASE_URL");
const e2eUrl = new URL(e2eBaseUrl);
const e2eHost = e2eUrl.hostname;
const e2ePort = e2eUrl.port || (e2eUrl.protocol === "https:" ? "443" : "80");
const cmsApiBaseUrl = requireEnv("CMS_API_BASE_URL");

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: "html",
  use: {
    baseURL: e2eBaseUrl,
    headless: true,
    trace: "on-first-retry",
    viewport: { height: 720, width: 1280 }
  },
  webServer: {
    command:
      `CMS_API_BASE_URL=${cmsApiBaseUrl} pnpm dev --host ${e2eHost} --port ${e2ePort} --strictPort`,
    reuseExistingServer: !process.env.CI,
    timeout: 60_000,
    url: e2eBaseUrl
  },
  projects: [
    {
      name: "webkit",
      use: { ...devices["Desktop Safari"] }
    },
    {
      name: "Google Chrome",
      use: { ...devices["Desktop Chrome"], channel: "chrome" }
    }
  ]
});

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
