import { addDays, addHours, subDays } from "date-fns";
import { fromZonedTime } from "date-fns-tz";
import { computeLotteryStatus, todayKeyTokyo, TOKYO_TZ } from "./time";
import type { AffiliateCampaign, CardGame, Lottery, LotteryWithRelations, Product, Shop } from "./types";

const iso = (date: Date) => date.toISOString();
const now = () => new Date();
const endOfTodayTokyo = () => fromZonedTime(`${todayKeyTokyo()}T23:59:00`, TOKYO_TZ);

export const cardGames: CardGame[] = [
  {
    id: "game-pokemon",
    name: "ポケモンカード",
    slug: "pokemon",
    description: "ポケモンカード関連の抽選・予約・再販情報を締切順に確認できます。",
    icon: "sparkles",
    displayOrder: 1,
    isActive: true
  },
  {
    id: "game-onepiece",
    name: "ワンピースカード",
    slug: "onepiece",
    description: "ワンピースカードの予約や抽選開始に備えるためのページです。",
    icon: "compass",
    displayOrder: 2,
    isActive: true
  },
  {
    id: "game-yugioh",
    name: "遊戯王",
    slug: "yugioh",
    description: "遊戯王OCG商品の発売予定と店舗抽選をまとめます。",
    icon: "layers",
    displayOrder: 3,
    isActive: true
  },
  {
    id: "game-other",
    name: "その他",
    slug: "other",
    description: "その他トレーディングカードの情報です。",
    icon: "cards",
    displayOrder: 4,
    isActive: true
  }
];

export const products: Product[] = [
  {
    id: "prod-aurora",
    cardGameId: "game-pokemon",
    name: "ポケカ デモ拡張パック 蒼翠のコンパス",
    slug: "sousui-compass",
    description: "カードゲットナビ用の架空サンプル商品です。実在の商品ではありません。",
    releaseDate: iso(addDays(now(), 10)),
    retailPrice: 5400,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/sousui-compass",
    isPublished: true,
    updatedAt: iso(now())
  },
  {
    id: "prod-night",
    cardGameId: "game-pokemon",
    name: "ポケカ サンプル強化BOX 星夜の導き",
    slug: "seiya-michibiki",
    description: "抽選導線確認用の架空BOX商品です。",
    releaseDate: iso(addDays(now(), 18)),
    retailPrice: 5800,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/seiya-michibiki",
    isPublished: true,
    updatedAt: iso(now())
  },
  {
    id: "prod-binder",
    cardGameId: "game-pokemon",
    name: "ポケカ デモカードファイル 旅路",
    slug: "tabiji-file",
    description: "関連商品の表示確認用プレースホルダーです。",
    releaseDate: iso(addDays(now(), 25)),
    retailPrice: 2200,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/tabiji-file",
    isPublished: true,
    updatedAt: iso(now())
  },
  {
    id: "prod-ocean",
    cardGameId: "game-onepiece",
    name: "ワンピースカード サンプル海図デッキ",
    slug: "sample-kaizu-deck",
    description: "将来拡張の確認用サンプルです。",
    releaseDate: iso(addDays(now(), 14)),
    retailPrice: 1320,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/kaizu",
    isPublished: true,
    updatedAt: iso(now())
  },
  {
    id: "prod-duel",
    cardGameId: "game-yugioh",
    name: "遊戯王 デモブースター 光路の札",
    slug: "kouro-fuda",
    description: "遊戯王カテゴリ確認用の架空商品です。",
    releaseDate: iso(addDays(now(), 30)),
    retailPrice: 4950,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/kouro",
    isPublished: true,
    updatedAt: iso(now())
  },
  {
    id: "prod-sleeve",
    cardGameId: "game-pokemon",
    name: "ポケカ サンプルデッキシールド みずたま",
    slug: "mizutama-shield",
    description: "周辺グッズの表示確認用サンプルです。",
    releaseDate: iso(addDays(now(), 7)),
    retailPrice: 990,
    imageUrl: "/placeholder-pack.svg",
    officialUrl: "https://example.com/products/mizutama",
    isPublished: true,
    updatedAt: iso(now())
  }
];

export const shops: Shop[] = [
  ["shop-a", "サンプルカード堂オンライン", "sample-card-do", "全国対応の架空オンライン店舗です。", "全国", "オンライン", true],
  ["shop-b", "デモホビー秋葉原", "demo-hobby-akiba", "東京都の架空カードショップです。", "東京都", "関東", false],
  ["shop-c", "サンプルトレカ大阪", "sample-toreca-osaka", "大阪府の架空店舗です。", "大阪府", "関西", false],
  ["shop-d", "デモブックス名古屋", "demo-books-nagoya", "愛知県の架空複合店です。", "愛知県", "東海", false],
  ["shop-e", "サンプルアプリストア", "sample-app-store", "アプリ応募の確認用店舗です。", "全国", "オンライン", true],
  ["shop-f", "デモ家電EC", "demo-kaden-ec", "EC応募の確認用広告非連動店舗です。", "全国", "オンライン", true],
  ["shop-g", "サンプル玩具札幌", "sample-toy-sapporo", "北海道の架空店舗です。", "北海道", "北海道", false],
  ["shop-h", "デモカード福岡", "demo-card-fukuoka", "福岡県の架空店舗です。", "福岡県", "九州", false]
].map(([id, name, slug, description, prefecture, area, isOnline]) => ({
  id: String(id),
  name: String(name),
  slug: String(slug),
  description: String(description),
  officialUrl: `https://example.com/shops/${slug}`,
  officialXUrl: "https://x.com/example",
  prefecture: String(prefecture),
  area: String(area),
  isOnline: Boolean(isOnline),
  isActive: true
}));

const lotterySeed: Array<Partial<Lottery> & Pick<Lottery, "id" | "productId" | "shopId" | "title" | "applicationMethod">> = [
  { id: "lot-1", productId: "prod-aurora", shopId: "shop-a", title: "蒼翠のコンパス 抽選販売", applicationMethod: "online", startAt: iso(subDays(now(), 2)), endAt: iso(endOfTodayTokyo()), requirements: ["会員登録", "本人確認"] },
  { id: "lot-2", productId: "prod-aurora", shopId: "shop-b", title: "店頭受取限定 抽選", applicationMethod: "store", startAt: iso(subDays(now(), 1)), endAt: iso(addHours(now(), 9)), requirements: ["店頭受取", "購入履歴"] },
  { id: "lot-3", productId: "prod-night", shopId: "shop-c", title: "星夜の導き 予約抽選", applicationMethod: "online", startAt: iso(subDays(now(), 3)), endAt: iso(addDays(now(), 2)), requirements: ["アプリ必要"] },
  { id: "lot-4", productId: "prod-night", shopId: "shop-d", title: "名古屋エリア抽選", applicationMethod: "store", startAt: iso(subDays(now(), 1)), endAt: iso(addDays(now(), 3)), requirements: ["会員登録", "店頭受取"] },
  { id: "lot-5", productId: "prod-binder", shopId: "shop-e", title: "カードファイル アプリ抽選", applicationMethod: "app", startAt: iso(subDays(now(), 1)), endAt: iso(addHours(now(), 20)), requirements: ["アプリ必要", "LINE登録"] },
  { id: "lot-6", productId: "prod-sleeve", shopId: "shop-f", title: "デッキシールド EC予約", applicationMethod: "online", startAt: iso(subDays(now(), 4)), endAt: iso(addDays(now(), 5)), requirements: ["会員登録"] },
  { id: "lot-7", productId: "prod-ocean", shopId: "shop-a", title: "海図デッキ 近日受付", applicationMethod: "online", startAt: iso(addDays(now(), 1)), endAt: iso(addDays(now(), 5)), requirements: ["会員登録"] },
  { id: "lot-8", productId: "prod-duel", shopId: "shop-g", title: "光路の札 近日店頭抽選", applicationMethod: "store", startAt: iso(addDays(now(), 2)), endAt: iso(addDays(now(), 6)), requirements: ["店頭受取"] },
  { id: "lot-9", productId: "prod-aurora", shopId: "shop-h", title: "福岡サンプル抽選 近日開始", applicationMethod: "sns", startAt: iso(addDays(now(), 6)), endAt: iso(addDays(now(), 8)), requirements: ["SNS応募"] },
  { id: "lot-10", productId: "prod-night", shopId: "shop-a", title: "終了済みオンライン抽選", applicationMethod: "online", startAt: iso(subDays(now(), 12)), endAt: iso(subDays(now(), 8)), requirements: ["本人確認"] },
  { id: "lot-11", productId: "prod-binder", shopId: "shop-b", title: "終了済み店頭抽選", applicationMethod: "store", startAt: iso(subDays(now(), 10)), endAt: iso(subDays(now(), 5)), requirements: ["店頭受取"] },
  { id: "lot-12", productId: "prod-sleeve", shopId: "shop-c", title: "終了済みアプリ抽選", applicationMethod: "app", startAt: iso(subDays(now(), 9)), endAt: iso(subDays(now(), 2)), requirements: ["アプリ必要"] },
  { id: "lot-13", productId: "prod-ocean", shopId: "shop-d", title: "終了済みSNS抽選", applicationMethod: "sns", startAt: iso(subDays(now(), 20)), endAt: iso(subDays(now(), 14)), requirements: ["SNS応募"] },
  { id: "lot-14", productId: "prod-duel", shopId: "shop-e", title: "受付中 LINE抽選", applicationMethod: "line", startAt: iso(subDays(now(), 1)), endAt: iso(addDays(now(), 4)), requirements: ["LINE登録"] },
  { id: "lot-15", productId: "prod-aurora", shopId: "shop-g", title: "札幌サンプル再販抽選", applicationMethod: "store", startAt: iso(subDays(now(), 2)), endAt: iso(addDays(now(), 1)), requirements: ["レシート必要", "店頭受取"] }
];

export const lotteries: Lottery[] = lotterySeed.map((item, index) => {
  const shop = shops.find((candidate) => candidate.id === item.shopId)!;
  return {
    officialApplicationUrl: `https://example.com/apply/${item.id}`,
    sourceUrl: `https://example.com/news/${item.id}`,
    sourceType: "manual",
    sourceCheckedAt: iso(index % 5 === 0 ? subDays(now(), 3) : now()),
    prefecture: shop.prefecture,
    area: shop.area,
    isOnline: shop.isOnline,
    requirements: [],
    isFeatured: index < 4,
    priority: index,
    isPublished: true,
    updatedAt: iso(now()),
    ...item
  } as Lottery;
});

export const affiliateCampaigns: AffiliateCampaign[] = [
  {
    id: "camp-1",
    advertiserName: "サンプル買取サービス",
    title: "不要カードの整理に使えるデモ買取案内",
    description: "カード整理を検討している方向けの架空広告です。",
    benefitText: "査定額アップのデモ特典",
    destinationUrl: "https://example.com/affiliate/buy",
    trackingMode: "internal_redirect",
    startAt: iso(subDays(now(), 1)),
    endAt: iso(addDays(now(), 30)),
    priority: 1,
    placement: "home_top",
    ctaLabel: "広告主サイトを見る",
    isActive: true
  },
  {
    id: "camp-2",
    advertiserName: "デモスリーブショップ",
    title: "抽選前に保護用品をチェック",
    description: "カードサプライの架空アフィリエイト案件です。",
    benefitText: "初回購入デモクーポン",
    destinationUrl: "https://example.com/affiliate/supply",
    trackingMode: "direct",
    startAt: iso(subDays(now(), 1)),
    endAt: iso(addDays(now(), 20)),
    priority: 2,
    placement: "home_inline",
    ctaLabel: "特典を確認する",
    isActive: true
  }
];

export function getLotteriesWithRelations(): LotteryWithRelations[] {
  return lotteries.map((lottery) => {
    const product = products.find((item) => item.id === lottery.productId)!;
    const shop = shops.find((item) => item.id === lottery.shopId)!;
    const cardGame = cardGames.find((item) => item.id === product.cardGameId)!;
    return {
      ...lottery,
      product,
      shop,
      cardGame,
      computedStatus: computeLotteryStatus(lottery)
    };
  });
}

export function activeLotteries() {
  return getLotteriesWithRelations().filter((lottery) =>
    ["open", "closing_soon"].includes(lottery.computedStatus)
  );
}
