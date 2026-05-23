# VeluneCMS Client

VeluneCMS API を外部アプリから読むための TypeScript client です。

```ts
import { createCmsClient } from "@velune-cms/client";

const cms = createCmsClient({
  baseUrl: "https://your-api.example.com",
  credentials: "include"
});

const portfolio = await cms.listContents({
  contentType: "portfolio"
});

const page = await cms.getContentBySlug("welcome");
```

VeluneCMS API はログインセッションを要求します。ブラウザで使う場合は `credentials: "include"` を渡し、事前に GitHub ログインを済ませます。

デフォルトでは `published` の content だけ返します。信頼できる環境で draft も読みたい場合だけ `includeDrafts: true` を渡します。

```ts
const drafts = await cms.listContents({
  includeDrafts: true
});
```

設定ファイルは CLI で生成できます。

`.env` に API URL を置くと、CLI はその値を使います。

```bash
VELUNE_API_URL=http://localhost:8787
```

```bash
pnpm velune init
```

ログイン URL を開く場合:

```bash
pnpm velune login
```

```ts
const cms = createCmsClient({
  baseUrl: "https://your-api.example.com",
  credentials: "include"
});

const contents = await cms.listContents();
```

カスタム header が必要な場合は `headers` を渡せます。

```ts
const cms = createCmsClient({
  baseUrl: "https://your-api.example.com",
  headers: {
    Authorization: `Bearer ${process.env.VELUNE_CMS_TOKEN}`
  }
});
```

## 内部構成

公開 API は `src/index.ts` からだけ export します。内部は resource ごとに分け、機能が増えても同じ単位で足せるようにしています。

```txt
src/
  client/       # createCmsClient と client 全体の型
  core/         # HTTP、query string、SDK共通エラー
  content/      # content 取得、公開/owner filter、content 型
  collection/   # content collection 取得、collection 型
  index.ts      # 外部公開する export
```
