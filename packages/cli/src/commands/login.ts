import { getApiUrl } from "../config/env.js";
import type { CliOptions } from "../lib/args.js";
import { openUrl } from "../lib/openUrl.js";

export function loginCommand(options: CliOptions): void {
  const apiUrl = getApiUrl(options);
  const redirectTo = String(options["redirect-to"] ?? "/contents");
  const loginUrl = new URL("/auth/github/login", apiUrl);
  // 認証後に管理画面へ戻すため、API側OAuth endpointへredirect先を渡す
  loginUrl.searchParams.set("redirectTo", redirectTo);

  if (options.print) {
    console.log(loginUrl.toString());
    return;
  }

  openUrl(loginUrl.toString());
  console.log(`Opened GitHub login: ${loginUrl.toString()}`);
}
