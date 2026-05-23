# VeluneCMS Client

VeluneCMS の静的コンテンツを読むための TypeScript client です。

本番 runtime では CMS API に接続せず、事前に `velune pull` で生成した `.velune/content.json` を読みます。

```bash
pnpm velune pull
```

```ts
import { createVeluneClient } from "@velune-cms/client";

const velune = createVeluneClient();

const portfolio = await velune.listContents({
  contentType: "portfolio"
});

const page = await velune.getContentBySlug("welcome");
```

デフォルトでは `published` の content だけ返します。build時に draft も読みたい場合だけ `includeDrafts: true` を渡します。

```ts
const drafts = await velune.listContents({
  includeDrafts: true
});
```

生成ファイルの場所を変える場合:

```ts
const velune = createVeluneClient({
  contentPath: "content/velune.json"
});
```

## 内部構成

```txt
src/
  client/       # createVeluneClient と client 型
  content/      # 静的content reader、filter、content 型
  index.ts      # 外部公開する export
```
