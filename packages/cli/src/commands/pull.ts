import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getApiUrl } from "../config/env.js";
import { getOptionalStringOption, type CliOptions } from "../lib/args.js";
import { createApiUrl } from "../lib/url.js";

type CmsPageListResponse = {
  items: unknown[];
  total: number;
};

type ContentCollectionListResponse = {
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
    cmsFetch<CmsPageListResponse>(apiUrl, "contents", token),
    cmsFetch<ContentCollectionListResponse>(
      apiUrl,
      "content-collections",
      token
    )
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

async function cmsFetch<T>(
  apiUrl: string,
  path: string,
  token: string | undefined
): Promise<T> {
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

  return (await response.json()) as T;
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
