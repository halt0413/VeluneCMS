import type { CollectionClient } from "../collection/types.js";
import type { ContentClient } from "../content/types.js";

export type CmsClientConfig = {
  baseUrl: string;
  credentials?: RequestCredentials;
  defaultIncludeDrafts?: boolean;
  fetch?: typeof fetch;
  headers?: HeadersInit;
};

export type CmsClient = CollectionClient & ContentClient;
