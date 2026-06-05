# VeluneCMS

## 概要

VeluneCMSは、エンジニアが自分のポートフォリオサイトで使うためのCMSです。

実績紹介、プロフィール、ブログ記事のようなポートフォリオ内のコンテンツを、管理画面から作成・更新できます。コードを直接編集しなくても、サイトに表示する文章やページ情報を管理できます。

公開サイト側では、CMSから書き出したファイルを静的に読み込んでコンテンツを表示できます。サイトを表示するたびにCMSへ通信しないため、公開サイトをシンプルで壊れにくい構成にできます。

## 解決すること

Webサイトの文章や実績を少し直したいだけなのに、毎回コードを編集してデプロイするのは手間がかかります。コンテンツが増えるほど、どこを編集すればよいか分かりにくくなり、更新も後回しになりがちです。

VeluneCMSを使うと、文章やページ情報の管理を専用の画面に分けられます。開発者はサイトの見た目や仕組みに集中し、コンテンツの更新は管理画面から行えます。

また、公開サイトで使うデータは事前にファイルとして書き出します。そのため、公開サイトはCMSのログイン状態やAPIの状態に直接依存せず、安定してコンテンツを表示できます。

## 機能

### 管理画面

- GitHubログイン
- コンテンツ一覧
- コンテンツ詳細
- コンテンツ作成
- コンテンツ編集
- コンテンツ削除
- 下書き保存
- 公開状態の管理
- コンテンツコレクションの作成
- コンテンツタイプによる絞り込み

### CLI

- GitHubログインURLの起動
- client configの生成
- CMSデータの静的JSON書き出し

### ライブラリ

- 静的JSONからのコンテンツ読み込み
- コンテンツ一覧取得
- slugによるコンテンツ取得
- contentTypeによる絞り込み
- draftの除外・取得制御

## 技術構成

### フロントエンド

- フレームワーク: React
- ルーティング: TanStack Router
- データ取得: TanStack Query
- ビルドツール: Vite
- 言語: TypeScript

### バックエンド

- ランタイム: Cloudflare Workers / Node.js
- APIフレームワーク: Hono
- 言語: TypeScript
- 認証: GitHub OAuth

### データベース

- Cloudflare D1
- Drizzle Kitによるmigration管理

### パッケージ

- CLI: Node.js
- 静的クライアント: `@velune-cms/client`
- パッケージ管理: pnpm workspace

### 開発ツール

- pnpm
- TypeScript
- ESLint
- oxlint
- Wrangler

## ドキュメント

- プロジェクト概要: `README.md`
- API環境変数サンプル: `apps/api/.dev.vars.example`
- D1 migration: `apps/api/migrations/`

## パッケージ構成

本プロジェクトではpnpm workspaceによるmonorepo構成を採用しています。

| type | name                  | description                        | default port |
| ---- | --------------------- | ---------------------------------- | ------------ |
| app  | `@velune-cms/console` | CMS管理画面                        | `3000`       |
| app  | `@velune-cms/api`     | CMS API                            | `8787`       |
| pkg  | `@velune-cms/cli`     | `velune` CLI                       | ---          |
| pkg  | `@velune-cms/client`  | 外部アプリ向け静的CMSクライアント  | ---          |
| pkg  | `@repo/content`       | コンテンツのvalidationと公開用変換 | ---          |
| pkg  | `@repo/github`        | GitHub連携ヘルパー                 | ---          |
| pkg  | `@repo/utils`         | 共通utility                        | ---          |

## ディレクトリ構成

```txt
apps/
  api/
    src/
      domain/          ドメインエンティティ、値オブジェクト、repository interface
      usecase/         アプリケーションユースケース
      infrastructure/  D1 repository、外部gateway実装
      presentation/    HTTP contract、controller、route
      middleware/      request middleware

  cms/
    src/
      routes/          ルーティング定義
      features/        画面単位、ユースケース単位の機能
      domain/          フロント用ドメインモデル
      infrastructure/  API client、外部IO
      components/      共通UIコンポーネント
      providers/       アプリ全体のProvider
      lib/             ライブラリ設定

packages/
  cli/         velune CLI
  cms-client/ 静的CMS client
  content/    content helper
  github/     GitHub helper
  utils/      汎用utility
```

## 環境構築

### 1. Node.jsを用意する

プロジェクトで利用するNode.jsを用意してください。

nodenv、nvm、Voltaなど、任意のバージョン管理ツールを使用できます。

### 2. pnpmを用意する

このプロジェクトではpnpm `10.16.1` を使用します。

```sh
npm i -g pnpm
pnpm -v
```

### 3. 環境変数を準備する

APIの環境変数は `apps/api/.dev.vars` に設定します。

必要な項目は次のファイルを参照してください。

```txt
apps/api/.dev.vars.example
```

### 4. 依存関係をインストールする

```sh
pnpm install
```

## ローカルサーバーの立ち上げ

### 管理画面

```sh
pnpm dev:cms
```

`http://localhost:3000` で起動します。

### API

ローカルNodeサーバーとして起動します。

```sh
pnpm dev:api
```

Cloudflare Workerとして起動します。

```sh
pnpm dev:api:worker
```

remote bindingを使ってCloudflare上のD1へ接続する場合は次のコマンドを使います。

```sh
pnpm dev:api:prod-db
```

## CLIの使い方

CLIのhelpを表示します。

```sh
pnpm velune --help
```

GitHubログインURLを開きます。

```sh
pnpm velune login --api-url http://localhost:8787
```

client configを生成します。

```sh
pnpm velune init
```

CMSデータを静的JSONとして書き出します。

```sh
pnpm velune pull --api-url http://localhost:8787
```

デフォルトでは次のファイルに出力されます。

```txt
.velune/content.json
```

## 静的クライアントの使い方

外部アプリでは `@velune-cms/client` をimportして使用します。

```ts
import { createVeluneClient } from "@velune-cms/client";

const velune = createVeluneClient({
  contentPath: ".velune/content.json",
});

const contents = await velune.listContents();
const page = await velune.getContentBySlug("welcome");
```

`getContent` と `getContentBySlug` は対象コンテンツが存在しない場合、または読み取り対象ではない場合に例外を投げます。


## その他のCLI

### 型チェック

```sh
pnpm typecheck
```

### lint

```sh
pnpm lint
```

### oxlint

```sh
pnpm lint:ox
```

### build

```sh
pnpm build
```

## パッケージ境界

業務モデルはshared packageではなく、各appの中で所有します。

- `apps/api/src/domain` はバックエンドのドメインモデルとAPI側contractを持ちます
- `apps/cms/src/domain` はAPI DTOから変換したフロント用ドメインモデルを持ちます
- `packages/content`、`packages/github`、`packages/utils` はプロダクトを支える再利用可能な処理に限定します
- `packages/cms-client` は公開用の静的client APIを提供します
