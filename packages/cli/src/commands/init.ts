import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";
import type { CliOptions } from "../lib/args.js";

export function initCommand(options: CliOptions): void {
  const output = resolve(String(options.output ?? "velune.config.ts"));

  if (existsSync(output) && !options.force) {
    throw new Error(`${output} already exists. Use --force to overwrite.`);
  }

  writeFileSync(output, createConfigFile());
  console.log(`Created ${output}`);
}

function createConfigFile(): string {
  return `import type { VeluneClientConfig } from "@velune-cms/client";

const config = {
  contentPath: ".velune/content.json"
} satisfies VeluneClientConfig;

export default config;
`;
}
