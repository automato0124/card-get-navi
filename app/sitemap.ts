import type { MetadataRoute } from "next";
import { getPublicData } from "@/lib/cms";
import { parseTokyoDate } from "@/lib/time";
import { absoluteUrl } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const { cardGames, products, shops } = await getPublicData();
  const staticPaths = ["", "/calendar", "/shops", "/contact"];
  return [
    ...staticPaths.map((path) => ({ url: absoluteUrl(path), lastModified: new Date() })),
    ...cardGames.map((game) => ({ url: absoluteUrl(`/cards/${game.slug}`), lastModified: new Date() })),
    ...products.map((product) => ({ url: absoluteUrl(`/products/${product.slug}`), lastModified: parseTokyoDate(product.updatedAt) })),
    ...shops.map((shop) => ({ url: absoluteUrl(`/shops/${shop.slug}`), lastModified: new Date() }))
  ];
}
