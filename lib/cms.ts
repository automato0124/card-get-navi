import { affiliateCampaigns as seedCampaigns, getLotteriesWithRelations as getSeedLotteriesWithRelations, products as seedProducts, shops as seedShops } from "./data";
import { computeLotteryStatus } from "./time";
import type { AffiliateCampaign, ApplicationMethod, CardGame, LotteryWithRelations, Product, Shop } from "./types";

type MicroCmsList<T> = {
  contents: T[];
  totalCount: number;
  offset: number;
  limit: number;
};

const endpoints = {
  cardGames: process.env.MICROCMS_CARD_GAMES_ENDPOINT,
  products: process.env.MICROCMS_PRODUCTS_ENDPOINT || "products",
  shops: process.env.MICROCMS_SHOPS_ENDPOINT || "shops",
  lotteries: process.env.MICROCMS_LOTTERIES_ENDPOINT || "lotteries",
  campaigns: process.env.MICROCMS_CAMPAIGNS_ENDPOINT || "affiliate-campaigns"
};

const pokemonCardGame: CardGame = {
  id: "game-pokemon",
  name: "ポケモンカード",
  slug: "pokemon",
  description: "ポケモンカードの抽選・予約・再販情報を締切順に確認できます。",
  icon: "sparkles",
  displayOrder: 1,
  isActive: true
};

function hasMicroCmsEnv() {
  return Boolean(process.env.MICROCMS_SERVICE_DOMAIN && process.env.MICROCMS_API_KEY);
}

function field(row: any, camel: string, snake?: string) {
  return row[camel] ?? row[snake || camel];
}

function refId(value: any) {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  return value.id || value.slug || undefined;
}

function firstValue<T>(value: T | T[] | undefined): T | undefined {
  return Array.isArray(value) ? value[0] : value;
}

function requirementsList(value: unknown) {
  if (Array.isArray(value)) return value.filter(Boolean).map(String);
  if (typeof value === "string") return value.split(/\r?\n/).map((item) => item.trim()).filter(Boolean);
  return [];
}

async function fetchList<T>(endpoint: string, queries: Record<string, string | number> = {}): Promise<T[] | null> {
  if (!hasMicroCmsEnv()) return null;
  const serviceDomain = process.env.MICROCMS_SERVICE_DOMAIN!;
  const params = new URLSearchParams({ limit: "100", ...Object.fromEntries(Object.entries(queries).map(([key, value]) => [key, String(value)])) });
  const url = `https://${serviceDomain}.microcms.io/api/v1/${endpoint}?${params.toString()}`;

  try {
    const response = await fetch(url, {
      headers: { "X-MICROCMS-API-KEY": process.env.MICROCMS_API_KEY! },
      next: { revalidate: 300 }
    });
    if (!response.ok) return null;
    const data = (await response.json()) as MicroCmsList<T>;
    return data.contents || [];
  } catch {
    return null;
  }
}

function toCardGame(row: any): CardGame {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    description: row.description || "",
    icon: row.icon || "cards",
    displayOrder: field(row, "displayOrder", "display_order") ?? 0,
    isActive: field(row, "isActive", "is_active") ?? true
  };
}

function toProduct(row: any): Product {
  const cardGame = field(row, "cardGame", "card_game");
  return {
    id: row.id,
    cardGameId: refId(cardGame) || field(row, "cardGameId", "card_game_id") || pokemonCardGame.id,
    name: row.name,
    slug: row.slug || row.id,
    description: row.description || "",
    releaseDate: field(row, "releaseDate", "release_date") || row.updatedAt,
    retailPrice: field(row, "retailPrice", "retail_price") ?? 0,
    imageUrl: field(row, "imageUrl", "image_url")?.url || field(row, "imageUrl", "image_url") || undefined,
    officialUrl: field(row, "officialUrl", "official_url") || undefined,
    seoTitle: field(row, "seoTitle", "seo_title") || undefined,
    seoDescription: field(row, "seoDescription", "seo_description") || undefined,
    isPublished: field(row, "isPublished", "is_published") ?? true,
    updatedAt: row.updatedAt
  };
}

function toShop(row: any): Shop {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug || row.id,
    description: row.description || "",
    officialUrl: field(row, "officialUrl", "official_url") || undefined,
    officialXUrl: field(row, "officialXUrl", "official_x_url") || undefined,
    prefecture: row.prefecture || "全国",
    area: row.area || "全国",
    isOnline: field(row, "isOnline", "is_online") ?? false,
    isActive: field(row, "isActive", "is_active") ?? true
  };
}

function toCampaign(row: any): AffiliateCampaign {
  return {
    id: row.id,
    advertiserName: field(row, "advertiserName", "advertiser_name") || "",
    title: row.title,
    description: row.description || "",
    benefitText: field(row, "benefitText", "benefit_text") || "",
    destinationUrl: field(row, "destinationUrl", "destination_url") || "",
    trackingUrl: field(row, "trackingUrl", "tracking_url") || undefined,
    trackingMode: field(row, "trackingMode", "tracking_mode") || "direct",
    imageUrl: field(row, "imageUrl", "image_url")?.url || field(row, "imageUrl", "image_url") || undefined,
    startAt: field(row, "startAt", "start_at") || row.createdAt,
    endAt: field(row, "endAt", "end_at") || row.updatedAt,
    priority: row.priority ?? 0,
    placement: row.placement || "home_inline",
    ctaLabel: field(row, "ctaLabel", "cta_label") || "詳細を見る",
    isActive: field(row, "isActive", "is_active") ?? true
  };
}

function toLotteryWithRelations(row: any, products: Product[], shops: Shop[], cardGames: CardGame[]): LotteryWithRelations | null {
  const productRef = refId(row.product) || field(row, "productId", "product_id");
  const shopRef = refId(row.shop) || field(row, "shopId", "shop_id");
  const product = products.find((item) => item.id === productRef || item.slug === productRef);
  const shop = shops.find((item) => item.id === shopRef || item.slug === shopRef);
  if (!product || !shop) return null;
  const cardGame = cardGames.find((item) => item.id === product.cardGameId || item.slug === product.cardGameId);
  if (!cardGame) return null;

  const lottery = {
    id: row.id,
    productId: product.id,
    shopId: shop.id,
    title: row.title,
    applicationMethod: firstValue(field(row, "applicationMethod", "application_method")) as ApplicationMethod || "online",
    startAt: field(row, "startAt", "start_at") || undefined,
    endAt: field(row, "endAt", "end_at") || undefined,
    resultAt: field(row, "resultAt", "result_at") || undefined,
    purchaseStartAt: field(row, "purchaseStartAt", "purchase_start_at") || undefined,
    purchaseEndAt: field(row, "purchaseEndAt", "purchase_end_at") || undefined,
    officialApplicationUrl: row.applyUrl || field(row, "officialApplicationUrl", "official_application_url") || undefined,
    sourceUrl: field(row, "sourceUrl", "source_url") || undefined,
    sourceType: field(row, "sourceType", "source_type") || "manual",
    sourceCheckedAt: field(row, "sourceCheckedAt", "source_checked_at") || row.updatedAt,
    prefecture: row.prefecture || shop.prefecture,
    area: row.area || shop.area,
    isOnline: field(row, "isOnline", "is_online") ?? shop.isOnline,
    requirements: requirementsList(row.requirements),
    notes: row.notes || undefined,
    statusOverride: field(row, "statusOverride", "status_override") || null,
    isFeatured: field(row, "isFeatured", "is_featured") ?? false,
    priority: row.priority ?? 0,
    isPublished: field(row, "isPublished", "is_published") ?? true,
    updatedAt: row.updatedAt,
    product,
    shop,
    cardGame
  };
  return { ...lottery, computedStatus: computeLotteryStatus(lottery) };
}

function isLotteryWithRelations(value: LotteryWithRelations | null): value is LotteryWithRelations {
  return value !== null;
}

export async function getCardGames(): Promise<CardGame[]> {
  if (!endpoints.cardGames) return [pokemonCardGame];
  const rows = await fetchList<any>(endpoints.cardGames, { orders: "displayOrder" });
  const cardGames = rows?.map(toCardGame).filter((item) => item.isActive) || [];
  return cardGames.length > 0 ? cardGames : [pokemonCardGame];
}

export async function getProducts(): Promise<Product[]> {
  const rows = await fetchList<any>(endpoints.products, { orders: "-updatedAt" });
  return rows
    ? rows.map(toProduct).filter((item) => item.isPublished)
    : seedProducts.filter((item) => item.cardGameId === pokemonCardGame.id);
}

export async function getShops(): Promise<Shop[]> {
  const rows = await fetchList<any>(endpoints.shops, { orders: "name" });
  return rows ? rows.map(toShop).filter((item) => item.isActive) : seedShops;
}

export async function getAffiliateCampaigns(): Promise<AffiliateCampaign[]> {
  const rows = await fetchList<any>(endpoints.campaigns, { orders: "priority" });
  return rows ? rows.map(toCampaign).filter((item) => item.isActive) : seedCampaigns;
}

export async function getLotteriesWithRelations(): Promise<LotteryWithRelations[]> {
  const [cardGames, products, shops, rows] = await Promise.all([
    getCardGames(),
    getProducts(),
    getShops(),
    fetchList<any>(endpoints.lotteries, { depth: 1, orders: "endAt" })
  ]);
  if (!rows) return getSeedLotteriesWithRelations().filter((item) => item.cardGame.slug === pokemonCardGame.slug);
  return rows
    .map((row) => toLotteryWithRelations(row, products, shops, cardGames))
    .filter(isLotteryWithRelations)
    .filter((item) => item.isPublished);
}

export async function getPublicData() {
  const [cardGames, products, shops, lotteries] = await Promise.all([
    getCardGames(),
    getProducts(),
    getShops(),
    getLotteriesWithRelations()
  ]);
  return { cardGames, products, shops, lotteries };
}
