import { createCollectionClient } from "../collection/collectionClient.js";
import { createContentClient } from "../content/contentClient.js";
import { createHttpClient } from "../core/httpClient.js";
import type { CmsClient, CmsClientConfig } from "./types.js";

export function createCmsClient({
  baseUrl,
  credentials,
  defaultIncludeDrafts = false,
  fetch: fetcher = fetch,
  headers
}: CmsClientConfig): CmsClient {
  // 公開SDKはresource clientを合成して返す 内部構成を増やしても利用側の入口はここだけにする
  const http = createHttpClient({
    baseUrl,
    credentials,
    fetcher,
    headers
  });

  const contentClient = createContentClient({
    defaultIncludeDrafts,
    http
  });

  const collectionClient = createCollectionClient({ http });

  return {
    ...contentClient,
    ...collectionClient
  };
}
