#!/usr/bin/env node
import { spawn } from "node:child_process";
import { existsSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

const DEFAULT_API_URL = process.env.VELUNE_API_URL ?? "http://localhost:8787";

const rawArgs = process.argv.slice(2);

if (rawArgs[0] === "--") {
  rawArgs.shift();
}

const [command, ...args] = rawArgs;

try {
  if (!command || command === "help" || command === "--help" || command === "-h") {
    printHelp();
  } else if (command === "login") {
    login(parseOptions(args));
  } else if (command === "init") {
    init(parseOptions(args));
  } else {
    throw new Error(`Unknown command: ${command}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}

function login(options) {
  const apiUrl = String(options["api-url"] ?? DEFAULT_API_URL);
  const redirectTo = String(options["redirect-to"] ?? "/contents");
  const loginUrl = new URL("/auth/github/login", apiUrl);
  loginUrl.searchParams.set("redirectTo", redirectTo);

  if (options.print) {
    console.log(loginUrl.toString());
    return;
  }

  openUrl(loginUrl.toString());
  console.log(`Opened GitHub login: ${loginUrl.toString()}`);
}

function init(options) {
  const apiUrl = String(options["api-url"] ?? DEFAULT_API_URL);
  const output = resolve(String(options.output ?? "velune.config.ts"));

  if (existsSync(output) && !options.force) {
    throw new Error(`${output} already exists. Use --force to overwrite.`);
  }

  writeFileSync(output, createConfigFile(apiUrl));
  console.log(`Created ${output}`);
}

function createConfigFile(apiUrl) {
  return `import type { CmsClientConfig } from "@velune-cms/client";

const config = {
  baseUrl: "${apiUrl}",
  credentials: "include"
} satisfies CmsClientConfig;

export default config;
`;
}

function parseOptions(args) {
  const options = {};

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];

    if (!arg.startsWith("--")) {
      continue;
    }

    const key = arg.slice(2);
    const next = args[index + 1];

    if (!next || next.startsWith("--")) {
      options[key] = true;
      continue;
    }

    options[key] = next;
    index += 1;
  }

  return options;
}

function openUrl(url) {
  const commandByPlatform = {
    darwin: "open",
    linux: "xdg-open",
    win32: "cmd"
  };
  const opener = commandByPlatform[process.platform];

  if (!opener) {
    console.log(url);
    return;
  }

  const args = process.platform === "win32" ? ["/c", "start", "", url] : [url];
  const child = spawn(opener, args, {
    detached: true,
    stdio: "ignore"
  });
  child.unref();
}

function printHelp() {
  console.log(`VeluneCMS CLI

Usage:
  velune login [--api-url <url>] [--redirect-to <path-or-url>] [--print]
  velune init [--api-url <url>] [--output <file>] [--force]

Examples:
  velune login --api-url http://localhost:8787
  velune init --api-url http://localhost:8787
`);
}
