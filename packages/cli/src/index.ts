#!/usr/bin/env node
import { initCommand } from "./commands/init.js";
import { loginCommand } from "./commands/login.js";
import { loadNearestEnvFile } from "./config/env.js";
import { parseOptions } from "./lib/args.js";

loadNearestEnvFile(process.cwd());

const rawArgs = process.argv.slice(2);

// root script経由だと `pnpm --filter ... start -- login` の `--` が残るため取り除く
if (rawArgs[0] === "--") {
  rawArgs.shift();
}

const [command, ...args] = rawArgs;

try {
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
  } else if (command === "login") {
    loginCommand(parseOptions(args));
  } else if (command === "init") {
    initCommand(parseOptions(args));
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function printHelp(): void {
  console.log(`VeluneCMS CLI

Usage:
  velune login [--api-url <url>] [--redirect-to <path-or-url>] [--print]
  velune init [--api-url <url>] [--output <file>] [--force]

Examples:
  velune login --api-url http://localhost:8787
  velune init --api-url http://localhost:8787
`);
}
