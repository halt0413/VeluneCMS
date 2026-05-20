import { CmsClientError } from "./errors.js";

export type CmsHttpClient = {
  get<T>(path: string): Promise<T>;
};

type CreateHttpClientInput = {
  baseUrl: string;
  credentials?: RequestCredentials;
  fetcher: typeof fetch;
  headers?: HeadersInit;
};

export function createHttpClient({
  baseUrl,
  credentials,
  fetcher,
  headers
}: CreateHttpClientInput): CmsHttpClient {
  const apiBaseUrl = baseUrl.endsWith("/") ? baseUrl : `${baseUrl}/`;

  return {
    async get<T>(path: string): Promise<T> {
      const response = await fetcher(new URL(path, apiBaseUrl), {
        credentials,
        headers: {
          Accept: "application/json",
          ...headers
        }
      });

      if (!response.ok) {
        const responseBody = await readResponseBody(response);
        // SDK利用側で原因を判定できるよう、整形messageとは別にAPIの生bodyも保持する
        throw new CmsClientError(
          getErrorMessage(response.status, responseBody),
          response.status,
          responseBody
        );
      }

      return (await response.json()) as T;
    }
  };
}

async function readResponseBody(response: Response): Promise<unknown> {
  const contentType = response.headers.get("content-type") ?? "";

  // エラーbodyは環境で形式が揺れるため、JSONを優先して失敗時はtextへ落とす
  if (contentType.includes("application/json")) {
    return response.json().catch(() => null);
  }

  return response.text().catch(() => null);
}

function getErrorMessage(status: number, responseBody: unknown): string {
  if (
    responseBody &&
    typeof responseBody === "object" &&
    "error" in responseBody
  ) {
    return String(responseBody.error);
  }

  return `VeluneCMS request failed: ${status}`;
}
