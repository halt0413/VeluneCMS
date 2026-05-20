import { getApiConfig } from "./getApiConfig";

export async function cmsFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const config = getApiConfig();
  const response = await fetch(new URL(path, config.baseUrl), {
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
