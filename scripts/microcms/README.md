# microCMS Bulk Tools

`data.json` に収集済みJSONを貼り付けて、microCMSへ一括登録・一括削除できます。

## 使い方

件数確認:

```bash
python3 scripts/microcms/microcms_bulk.py count
```

一括登録:

```bash
python3 scripts/microcms/microcms_bulk.py insert
```

一括削除:

```bash
python3 scripts/microcms/microcms_bulk.py delete --yes
```

## 入力JSON

`scripts/microcms/data.json` に以下の形で貼り付けます。

```json
{
  "products": [],
  "shops": [],
  "lotteries": []
}
```

`lotteries` は `productSlug` と `shopSlug` で商品・店舗を指定します。スクリプトがmicroCMSのcontent IDへ変換して、`product` / `shop` のコンテンツ参照フィールドへ登録します。

## 変換仕様

- URLはMarkdownリンク形式でも通常URLに直します
- `utm_source=chatgpt.com` は削除します
- `applicationMethod` はmicroCMSのセレクト型に合わせて配列へ変換します
- `lotteries` の `startAt` は現在のCMSでは使わないためPOSTしません
- `products` に含まれる `releaseDate` や `retailPrice` は、現在の表示では使わないためPOSTしません
- `lotteries` に含まれる `requirements`, `notes`, `sourceUrl` は、現在の表示では使わないためPOSTしません

## 必要なAPI権限

`.env` の `MICROCMS_API_KEY` に、対象APIの `GET` / `POST` / `DELETE` 権限が必要です。
