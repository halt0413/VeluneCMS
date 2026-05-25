import { getApiUrl } from "../config/env.js";
import { getOptionalStringOption, type CliOptions } from "../lib/args.js";
import { openUrl } from "../lib/openUrl.js";
import { createApiUrl } from "../lib/url.js";

export function loginCommand(options: CliOptions): void {
  const apiUrl = getApiUrl(options);
  const redirectTo = getOptionalStringOption(options, "redirect-to") ?? "/contents";
  const loginUrl = createApiUrl(apiUrl, "auth/github/login");
  // 認証後に管理画面へ戻すため、API側OAuth endpointへredirect先を渡す
  loginUrl.searchParams.set("redirectTo", redirectTo);

  if (options.print) {
    console.log(loginUrl.toString());
    return;
  }

  openUrl(loginUrl.toString());
  console.log(`Opened GitHub login: ${loginUrl.toString()}`);
}
