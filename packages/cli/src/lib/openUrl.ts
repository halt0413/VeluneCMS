import { spawn } from "node:child_process";

export function openUrl(url: string): void {
  const opener = getOpenCommand();

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

function getOpenCommand(): string | undefined {
  if (process.platform === "darwin") {
    return "open";
  }

  if (process.platform === "linux") {
    return "xdg-open";
  }

  if (process.platform === "win32") {
    return "cmd";
  }

  return undefined;
}
