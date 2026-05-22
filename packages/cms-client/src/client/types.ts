import type { CollectionClient } from "../collection/types.js";
import type { ContentClient } from "../content/types.js";

export type CmsClientConfig = {
  baseUrl: string;
  // ブラウザ利用ではログインsession cookieを送るため、必要に応じて "include" を指定する
  credentials?: RequestCredentials;
  defaultIncludeDrafts?: boolean;
  // SSRやテストではglobal fetchではなく、呼び出し側のfetch実装を注入できるようにする
  fetch?: typeof fetch;
  headers?: HeadersInit;
};

export type CmsClient = CollectionClient & ContentClient;
