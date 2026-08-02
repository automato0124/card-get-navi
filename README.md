# カードゲットナビ

ポケモンカードの抽選販売・予約販売・再販・在庫入荷・発売予定・応募締切を締切順に確認できる Web メディアの MVP です。

## 技術構成

- Next.js App Router / TypeScript / Tailwind CSS
- shadcn/ui 相当のローカル UI コンポーネント設計
- microCMS / Next.js App Router 想定
- Zod / date-fns / date-fns-tz
- Vitest
- pnpm / Vercel

## ディレクトリ構成

- `app/`: 公開ページ、管理画面、API Route、SEO Route
- `components/`: ロゴ、ヘッダー、抽選カード、広告、管理画面
- `lib/`: 型、サンプルデータ、日時、セキュリティ、microCMS ヘルパー
- `tests/`: unit

## 環境変数

`.env.example` を参照してください。

- `NEXT_PUBLIC_SITE_URL`
- `MICROCMS_SERVICE_DOMAIN`
- `MICROCMS_API_KEY`
- `MICROCMS_*_ENDPOINT`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

本番ドメインは `https://card-get-navi.com` です。`NEXT_PUBLIC_SITE_URL` にはこのURLを設定します。

## microCMS

1. microCMS でサービスを作成
2. APIキーを作成し、コンテンツの GET 権限を付与
3. `.env.local` に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を設定
4. APIを `products`、`shops`、`lotteries`、`affiliate-campaigns` の名前で作成

環境変数が未設定、または読み取りに失敗した場合は、画面確認用のローカルサンプルデータへフォールバックします。

### microCMS API項目

フィールドIDは camelCase 推奨です。既存の snake_case 名も一部読み取れるようにしています。

- `products`: `name`, `slug`, `description`, `releaseDate`, `retailPrice`, `imageUrl`, `officialUrl`, `seoDescription`, `isPublished`
- `shops`: `name`, `slug`, `description`, `officialUrl`, `officialXUrl`, `prefecture`, `area`, `isOnline`, `isActive`
- `lotteries`: `product`（コンテンツ参照）, `shop`（コンテンツ参照）, `title`, `applicationMethod`, `startAt`, `endAt`, `applyUrl`, `requirements`, `isPublished`
- `affiliate-campaigns`: `advertiserName`, `title`, `description`, `benefitText`, `destinationUrl`, `trackingUrl`, `trackingMode`, `startAt`, `endAt`, `priority`, `placement`, `ctaLabel`, `isActive`

ポケカ特化の初期運用では `card-games` API は作りません。アプリ側で「ポケモンカード」を固定カテゴリとして扱います。
無料枠で始める場合は、まず上記4 APIと最小フィールドだけで十分です。

日時フィールドは日本時間（Asia/Tokyo）として扱います。microCMS の日時入力では、締切が `2026/08/02 23:59` なら日本時間の `2026/08/02 23:59` として登録してください。アプリ側でもタイムゾーンなしの日時文字列は UTC ではなく日本時間として解釈します。

microCMS のフィールドIDは20文字以内にします。応募URLは `officialApplicationUrl` ではなく、短い `applyUrl` を使ってください。URL系フィールド（`officialUrl`, `applyUrl`, `destinationUrl`, `trackingUrl` など）の入力値には文字数上限を設定しないでください。

## ローカル起動

```bash
pnpm install
pnpm dev
```

`http://localhost:3000` を開きます。

## テスト

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## 主なページ

- `/`: トップ、締切順一覧、URL同期フィルター、広告枠
- `/products/[slug]`: 商品別
- `/shops`、`/shops/[slug]`: 店舗一覧・店舗別
- `/calendar`: 月別締切・開始・発売カレンダー
- `/admin`: 管理画面
- `/contact`

## CSV 項目

`id,title,product_id,shop_id,application_method,start_at,end_at,official_application_url,requirements`

管理画面の CSV 出力ボタンで同形式を確認できます。インポート UI は枠を用意しており、本番運用では microCMS の管理画面またはCSVインポートを使います。

## アフィリエイト

広告案件は `affiliate_campaigns` で管理します。`tracking_mode` が `direct` の場合は広告 URL へ直接遷移し、`internal_redirect` の場合は `/go/[campaignId]` で登録済み URL のみへリダイレクトします。広告枠には `PR`、`広告`、`アフィリエイト広告を含みます` を明記します。

## X 投稿文

管理画面の抽選情報カードに「X投稿文」とコピー機能があります。文字数が 280 文字を超える場合は警告表示します。

## Vercel デプロイ

1. GitHub 等へ push
2. Vercel で Next.js として import
3. `.env.example` の値を本番環境変数として設定
4. microCMS の Service Domain と API Key を設定
5. Deploy

## 運用フロー

1. 公式ページを確認
2. 管理画面または CSV で抽選情報を登録
3. `source_url` と `source_checked_at` を更新
4. 48 時間以上未確認の情報を優先的に再確認
5. 広告案件は PR 表記と掲載期間を確認して公開

## 実装時の仮定

- 初期リリースは一般ユーザー登録なし
- 無許可スクレイピングは実装しない
- サンプルデータはすべて架空で、実在商品・店舗情報を転載しない
- microCMS 未設定でも画面確認できるよう、ローカルサンプルデータを既定にする
- 管理画面の CRUD はローカル確認用。実運用では microCMS 管理画面でコンテンツを編集する

## 今後の拡張

- microCMS Webhook による再検証
- 抽選・商品・店舗・広告の入力補助
- CSV import のパースとバリデーション詳細表示
- Google スプレッドシート連携 API
- 広告クリック集計ダッシュボード
