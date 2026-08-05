import type { Metadata } from "next";
import { absoluteUrl } from "./utils";

export const siteName = "カードゲットナビ";
export const defaultDescription = "ポケカの抽選販売、予約、再販情報を締切順に確認できます。応募条件、締切日時、公式応募ページをまとめてチェックできます。";

type SeoOptions = {
  title?: string;
  description?: string;
  path?: string;
  imageUrl?: string;
  imageAlt?: string;
  noIndex?: boolean;
};

export function createMetadata({ title, description = defaultDescription, path = "/", imageUrl, imageAlt, noIndex = false }: SeoOptions = {}): Metadata {
  const url = absoluteUrl(path);
  const fullTitle = title ? `${title}｜${siteName}` : `${siteName}｜ポケカ抽選・予約・再販情報`;
  const ogImage = imageUrl || absoluteUrl("/opengraph-image");
  const ogImageAlt = imageAlt || siteName;

  return {
    title: title
      ? {
          absolute: fullTitle
        }
      : {
          default: fullTitle,
          template: `%s｜${siteName}`
        },
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName,
      locale: "ja_JP",
      type: "website",
      images: [{ url: ogImage, width: 1200, height: 630, alt: ogImageAlt }]
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [ogImage]
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true }
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteName,
    url: absoluteUrl(),
    inLanguage: "ja-JP",
    publisher: {
      "@type": "Organization",
      name: siteName,
      url: absoluteUrl()
    }
  };
}
