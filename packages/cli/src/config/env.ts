import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import type { CliOptions } from "../lib/args.js";

export function getApiUrl(options: CliOptions): string {
  // CLI引数を最優先にし、プロジェクトごとの.env設定、汎用API_URLの順で解決する
  const apiUrl = options["api-url"] ?? process.env.VELUNE_API_URL ?? process.env.API_URL;

  if (!apiUrl || apiUrl === true) {
    throw new Error("VELUNE_API_URL or --api-url is required.");
  }

  return apiUrl;
}

export function loadNearestEnvFile(startDirectory: string): void {
  const envPath = findNearestEnvFile(startDirectory);

  if (!envPath) {
    return;
  }

  // npm scriptやnpx経由でも同じ設定を使えるよう、cwdから近い.envを軽量に読む
  for (const line of readFileSync(envPath, "utf8").split(/\r?\n/u)) {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      continue;
    }

    const separatorIndex = trimmedLine.indexOf("=");

    if (separatorIndex === -1) {
      continue;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const value = trimmedLine.slice(separatorIndex + 1).trim();

    if (key && process.env[key] === undefined) {
      process.env[key] = stripEnvQuotes(value);
    }
  }
}

function findNearestEnvFile(startDirectory: string): string | undefined {
  let currentDirectory = startDirectory;

  while (true) {
    // パッケージ配下から実行してもrepo rootの.envを拾えるよう、親方向へ探索する
    const envPath = join(currentDirectory, ".env");

    if (existsSync(envPath)) {
      return envPath;
    }

    const parentDirectory = dirname(currentDirectory);

    if (parentDirectory === currentDirectory || currentDirectory === parse(currentDirectory).root) {
      return undefined;
    }

    currentDirectory = parentDirectory;
  }
}

function stripEnvQuotes(value: string): string {
  if (
    (value.startsWith("\"") && value.endsWith("\"")) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    return value.slice(1, -1);
  }

  return value;
}
