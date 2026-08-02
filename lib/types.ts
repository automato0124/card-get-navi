export type LotteryStatus =
  | "draft"
  | "upcoming"
  | "open"
  | "closing_soon"
  | "ended"
  | "unknown"
  | "suspended";

export type ApplicationMethod = "online" | "store" | "app" | "sns" | "line";

export type CardGame = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  displayOrder: number;
  isActive: boolean;
};

export type Product = {
  id: string;
  cardGameId: string;
  name: string;
  slug: string;
  description: string;
  releaseDate: string;
  retailPrice: number;
  imageUrl?: string;
  officialUrl?: string;
  seoTitle?: string;
  seoDescription?: string;
  isPublished: boolean;
  updatedAt: string;
};

export type Shop = {
  id: string;
  name: string;
  slug: string;
  description: string;
  officialUrl?: string;
  officialXUrl?: string;
  prefecture: string;
  area: string;
  isOnline: boolean;
  isActive: boolean;
};

export type Lottery = {
  id: string;
  productId: string;
  shopId: string;
  title: string;
  applicationMethod: ApplicationMethod;
  startAt?: string;
  endAt?: string;
  resultAt?: string;
  purchaseStartAt?: string;
  purchaseEndAt?: string;
  officialApplicationUrl?: string;
  sourceUrl?: string;
  sourceType: "official" | "rss" | "manual" | "api";
  sourceCheckedAt: string;
  prefecture: string;
  area: string;
  isOnline: boolean;
  requirements: string[];
  notes?: string;
  statusOverride?: LotteryStatus | null;
  isFeatured: boolean;
  priority: number;
  isPublished: boolean;
  updatedAt: string;
};

export type AffiliateCampaign = {
  id: string;
  advertiserName: string;
  title: string;
  description: string;
  benefitText: string;
  destinationUrl: string;
  trackingUrl?: string;
  trackingMode: "direct" | "internal_redirect";
  imageUrl?: string;
  startAt: string;
  endAt: string;
  priority: number;
  placement:
    | "home_top"
    | "home_inline"
    | "product_top"
    | "product_inline"
    | "before_ended"
    | "sidebar"
    | "mobile_sticky";
  ctaLabel: string;
  isActive: boolean;
};

export type LotteryWithRelations = Lottery & {
  product: Product;
  shop: Shop;
  cardGame: CardGame;
  computedStatus: LotteryStatus;
};
