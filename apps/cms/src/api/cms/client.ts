import { getApiConfig } from "./getApiConfig";

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getApiConfig();
  // GitHubログインのsession cookieでユーザーを判定するため、管理画面のAPI呼び出しはcookie送信を既定にする
  const response = await fetch(createCmsApiUrl(config.baseUrl, path), {
    ...init,
    credentials: init?.credentials ?? "include",
    headers: {
      "Content-Type": "application/json",
      ...init?.headers
    },
    cache: "no-store"
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => null);
    const errorMessage =
      errorBody && typeof errorBody === "object" && "error" in errorBody
        ? String(errorBody.error)
        : `CMS API request failed: ${response.status}`;

    throw new Error(errorMessage);
  }

  return (await response.json()) as T;
}

function createCmsApiUrl(baseUrl: string, path: string): URL {
  const normalizedBase = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;
  const normalizedPath = path.startsWith("/") ? path.slice(1) : path;

  return new URL(normalizedPath, normalizedBase);
}
