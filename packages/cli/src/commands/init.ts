import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import { getApiUrl } from "../config/env.js";
import type { CliOptions } from "../lib/args.js";

export function initCommand(options: CliOptions): void {
  const apiUrl = getApiUrl(options);
  const output = resolve(String(options.output ?? "velune.config.ts"));

  if (existsSync(output) && !options.force) {
    throw new Error(`${output} already exists. Use --force to overwrite.`);
  }

  writeFileSync(output, createConfigFile(apiUrl));
  console.log(`Created ${output}`);
}

function createConfigFile(apiUrl: string): string {
  // 生成ファイルは利用アプリ側に置かれるため、runtime importではなくtype importだけにする
  return `import type { CmsClientConfig } from "@velune-cms/client";

const config = {
  baseUrl: "${apiUrl}",
  credentials: "include"
} satisfies CmsClientConfig;

export default config;
`;
}
