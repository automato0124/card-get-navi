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

本番ドメインは `https://card-get-navi.com` です。`NEXT_PUBLIC_SITE_URL` にはこのURLを設定します。

## microCMS

1. microCMS でサービスを作成
2. APIキーを作成し、コンテンツの GET 権限を付与
3. `.env.local` に `MICROCMS_SERVICE_DOMAIN` と `MICROCMS_API_KEY` を設定
4. APIを `products`、`shops`、`lotteries`、`affiliate-campaigns` の名前で作成

環境変数が未設定、または読み取りに失敗した場合は、画面確認用のローカルサンプルデータへフォールバックします。

### microCMS API項目

フィールドIDは camelCase 推奨です。既存の snake_case 名も一部読み取れるようにしています。

- `products`: `name`, `slug`, `description`, `imageUrl`, `officialUrl`, `seoDescription`, `isPublished`
- `shops`: `name`, `slug`, `description`, `officialUrl`, `officialXUrl`, `prefecture`, `area`, `isOnline`, `isActive`
- `lotteries`: `product`（コンテンツ参照）, `shop`（コンテンツ参照）, `title`, `applicationMethod`, `startAt`, `endAt`, `applyUrl`, `isPublished`
- `affiliate-campaigns`: `advertiserName`, `title`, `description`, `benefitText`, `destinationUrl`, `trackingUrl`, `trackingMode`, `startAt`, `endAt`, `priority`, `placement`, `ctaLabel`, `isActive`

ポケカ特化の初期運用では `card-games` API は作りません。アプリ側で「ポケモンカード」を固定カテゴリとして扱います。
無料枠で始める場合は、まず上記4 APIと最小フィールドだけで十分です。

日時フィールドは日本時間（Asia/Tokyo）として扱います。microCMS の日時入力では、締切が `2026/08/02 23:59` なら日本時間の `2026/08/02 23:59` として登録してください。アプリ側でもタイムゾーンなしの日時文字列は UTC ではなく日本時間として解釈します。

microCMS のフィールドIDは20文字以内にします。応募URLは `officialApplicationUrl` ではなく、短い `applyUrl` を使ってください。URL系フィールド（`officialUrl`, `applyUrl`, `destinationUrl`, `trackingUrl` など）の入力値には文字数上限を設定しないでください。

### 情報収集メタプロンプト

POST APIで登録する前提の収集データは、次のプロンプトで作成します。出力されたJSONを `scripts/microcms/data.json` に貼り付けて、一括登録します。

```text
あなたはポケモンカード抽選情報のリサーチャー兼データ整形担当です。

目的:
指定したポケモンカード商品の抽選販売・予約抽選・再販抽選情報を広く収集し、カードゲットナビのmicroCMS POST APIへそのまま投入できるJSON形式に整形してください。

対象API:
- products
- shops
- lotteries

対象商品:
- ポケモンカードゲーム 30周年 FUTURISTIC BOX
- ポケモンカードゲーム 30周年 エーフィ・ブラッキーデッキ
- ポケモンカードゲーム 30周年 拡張パック
- ポケモンカードゲーム 30周年 御三家カードセット
- ポケモンカードゲーム アビスアイ
- ポケモンカードゲーム スターターセットex
- ポケモンカードゲーム ストームエメラルダ
- ポケモンカードゲーム バトルコレクション
- ポケモンカードゲーム ブラックボルト
- ポケモンカードゲーム ホワイトフレア
- ポケモンカードゲーム メガシンフォニア
- ポケモンカードゲーム メガブレイブ

調査対象ショップ:
- Amazon
- ポケモンセンターオンライン
- ゲオ
- TSUTAYA
- 古本市場
- ホビーステーション
- カードラボ
- カードボックス
- 晴れる屋2
- ドラゴンスター
- トレカチャンピオン
- イエローサブマリン
- Joshin
- ヨドバシカメラ
- ビックカメラ
- ヤマダデンキ
- エディオン
- WonderGOO
- 全国のカードショップ公式サイト・公式X

重要ルール:
- 情報源は必ず公式サイト、公式アプリ告知、公式X、店舗公式ページ、信頼できる販売店ページのみ。
- Amazonは販売元または応募ページが公式に確認できるものだけを対象にする。
- 不明な情報は推測しない。
- 日時は必ず日本時間で `YYYY-MM-DDTHH:mm:ss+09:00` 形式にする。例: `2026-08-06T17:59:00+09:00`
- 締切日時 `endAt` は特に正確に確認する。
- `applicationMethod` は `online` または `store` のどちらかだけにする。
- 応募URL、アフィリエイトURLを貼る場合は `lotteries.applyUrl` に入れる。
- `releaseDate`, `retailPrice`, `requirements`, `notes`, `sourceUrl`, `sourceType`, `isFeatured`, `priority` は出力しない。
- productやshopの重複を避けるため、必ずslugを安定した英数字・ハイフンで作る。
- 画像URLは必ず探す。優先順位は 1. 商品公式ページの `og:image` 2. 商品公式ページ内のメイン画像 3. ポケモンセンターオンラインの商品画像 4. Amazonの商品画像。
- imageUrlは `https://...` から始まる絶対URLにする。相対URLはページURLを基準に絶対URLへ変換する。
- 画像URLがCSS背景画像や遅延読み込み属性にある場合も確認する。
- どうしても商品画像URLが取得できない場合のみ空文字にする。
- 終了済みの抽選も収集対象に含めるが、締切日時は必ず入れる。
- URLはMarkdownリンクにせず、通常のURL文字列だけを入れる。
- `utm_source=chatgpt.com` など調査由来のパラメータは付けない。
- 同じ商品・同じ店舗は必ず1件にまとめる。
- 店舗が複数商品を同時に抽選している場合、商品ごとにlotteriesを分ける。
- 応募開始日時が未公表の場合のみ `startAt` は空文字にする。
- 応募締切日時が不明な抽選はlotteriesに含めない。
- 受付中、近日開始、締切済みを問わず、上記対象商品の抽選情報をできるだけ多く集める。
- 同一URLで複数商品の抽選を受け付けている場合も、lotteriesは商品ごとに分ける。
- 公式Xのみで告知されている場合、applyUrlには応募先または告知ポストURLを入れる。

出力形式:
以下のJSONだけを返してください。説明文は不要です。

{
  "products": [
    {
      "name": "",
      "slug": "",
      "description": "",
      "imageUrl": "",
      "officialUrl": "",
      "seoDescription": "",
      "isPublished": true
    }
  ],
  "shops": [
    {
      "name": "",
      "slug": "",
      "description": "",
      "officialUrl": "",
      "officialXUrl": "",
      "prefecture": "",
      "area": "",
      "isOnline": true,
      "isActive": true
    }
  ],
  "lotteries": [
    {
      "productSlug": "",
      "shopSlug": "",
      "title": "",
      "applicationMethod": "online",
      "startAt": "",
      "endAt": "",
      "applyUrl": "",
      "prefecture": "",
      "area": "",
      "isOnline": true,
      "isPublished": true
    }
  ]
}

各項目の作り方:

products:
- name: 商品名を正式名称で入れる
- slug: 商品名から英数字・ハイフンで作る
- description: 商品そのものの説明を2〜3文で入れる。店舗名や抽選条件は入れない
- imageUrl: 公式・販売店の商品画像URL。必ず探索し、取得できなければ空文字
- officialUrl: 商品公式ページ
- seoDescription: 「商品名の抽選・予約・再販情報」向けの短い説明
- isPublished: true

shops:
- name: 店舗名・サービス名
- slug: 店舗名から英数字・ハイフンで作る
- description: 抽選方式や主な販売形態が分かる短い説明。不明なら空文字
- officialUrl: 店舗公式サイト
- officialXUrl: 公式X URL。なければ空文字
- prefecture: オンライン全国対象なら「全国」。実店舗抽選なら都道府県
- area: 「全国」「関東」「関西」など
- isOnline: オンライン応募ならtrue、店頭応募中心ならfalse
- isActive: true

lotteries:
- productSlug: productsのslugと一致させる
- shopSlug: shopsのslugと一致させる
- title: 「商品名 店舗名 抽選販売」など分かりやすいタイトル。商品名と店舗名を必ず含める
- applicationMethod: online または store
- startAt: 応募開始日時。未公表なら空文字
- endAt: 応募締切日時。必須
- applyUrl: 応募ページURL。アフィリエイトリンクを使う場合もここ
- prefecture: 抽選対象エリア。全国対象なら「全国」
- area: 抽選対象の広域エリア。全国対象なら「全国」
- isOnline: 応募がオンラインならtrue
- isPublished: true

品質チェック:
- JSONとしてパースできること
- productsのslugとlotteriesのproductSlugが一致していること
- shopsのslugとlotteriesのshopSlugが一致していること
- URLがMarkdown形式になっていないこと
- endAtが空のlotteriesがないこと
- applicationMethodがonline/store以外になっていないこと
- productsのimageUrlを可能な限り埋めていること
- 対象商品リストのうち、情報が見つかった商品をproductsに入れていること
- 主要ショップごとに抽選情報を確認していること
```

### POST API一括操作

収集したJSONは `scripts/microcms/data.json` に貼り付けます。

```bash
# 件数確認
python3 scripts/microcms/microcms_bulk.py count

# 一括登録
python3 scripts/microcms/microcms_bulk.py insert

# 一括削除
python3 scripts/microcms/microcms_bulk.py delete --yes
```

スクリプトは標準ライブラリだけで動きます。詳細は `scripts/microcms/README.md` を参照してください。

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
- `/admin`: ローカル確認用の管理画面
- `/contact`

## CSV 項目

`id,title,product_id,shop_id,application_method,start_at,end_at,official_application_url`

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
