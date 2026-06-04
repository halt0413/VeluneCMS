import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getApiUrl } from "../config/env.js";
import { getOptionalStringOption, type CliOptions } from "../lib/args.js";
import { createApiUrl } from "../lib/url.js";

type CmsListResponse = {
  items: unknown[];
  total: number;
};

type VeluneContentFile = {
  collections: unknown[];
  contents: unknown[];
  generatedAt: string;
};

export async function pullCommand(options: CliOptions): Promise<void> {
  const apiUrl = getApiUrl(options);
  const output = resolve(
    getOptionalStringOption(options, "output") ?? ".velune/content.json"
  );
  const token = getApiToken(options);
  const [contents, collections] = await Promise.all([
    cmsFetch(apiUrl, "contents", token),
    cmsFetch(apiUrl, "content-collections", token)
  ]);
  const payload: VeluneContentFile = {
    collections: collections.items,
    contents: contents.items,
    generatedAt: new Date().toISOString()
  };

  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(payload, null, 2)}\n`);
  console.log(`Pulled ${contents.items.length} contents to ${output}`);
}

async function cmsFetch(
  apiUrl: string,
  path: string,
  token: string | undefined
): Promise<CmsListResponse> {
  const headers: Record<string, string> = {
    Accept: "application/json"
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(createApiUrl(apiUrl, path), {
    headers
  });

  if (!response.ok) {
    throw new Error(`VeluneCMS pull failed: ${response.status}`);
  }

  const body: unknown = await response.json();

  if (!isCmsListResponse(body)) {
    throw new Error("VeluneCMS pull failed: invalid response body");
  }

  return body;
}

function isCmsListResponse(value: unknown): value is CmsListResponse {
  if (!isRecord(value)) {
    return false;
  }

  return Array.isArray(value.items) && typeof value.total === "number";
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function getApiToken(options: CliOptions): string | undefined {
  const cliToken = getOptionalStringOption(options, "token");
  const token =
    cliToken ??
    process.env.VELUNE_API_TOKEN ??
    process.env.CMS_API_TOKEN ??
    process.env.ADMIN_API_TOKEN;

  return token;
}
