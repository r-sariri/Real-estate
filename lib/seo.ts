import type { SiteSettings } from "./settings";

/**
 * Canonical site origin. Set NEXT_PUBLIC_SITE_URL in the deployment environment
 * (e.g. https://zarrin.ir). Falls back to the dev host so links stay valid.
 */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");

export function absoluteUrl(path = "/"): string {
  return `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`;
}

export function organizationJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "JewelryStore",
    name: settings.brandName,
    alternateName: settings.brandLatin,
    url: SITE_URL,
    logo: absoluteUrl("/hero.jpg"),
    description: settings.metaDescription,
    telephone: settings.phone,
    email: settings.email,
    address: { "@type": "PostalAddress", addressCountry: "IR", streetAddress: settings.address },
    sameAs: [settings.instagram, settings.telegram].filter(Boolean),
    currenciesAccepted: "IRR",
    paymentAccepted: "Cash, Credit Card",
    areaServed: "IR",
  };
}

export function websiteJsonLd(settings: SiteSettings) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.brandName,
    url: SITE_URL,
    inLanguage: "fa-IR",
    potentialAction: {
      "@type": "SearchAction",
      target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/shop?q={search_term_string}` },
      "query-input": "required name=search_term_string",
    },
  };
}

export function productJsonLd(product: {
  name: string;
  slug: string;
  description: string;
  images: string[];
  price: number;
  inStock: boolean;
  purity: number;
  weightGrams: number;
  ratingValue?: number;
  reviewCount?: number;
  brandName: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((image) => absoluteUrl(image)),
    sku: product.slug,
    brand: { "@type": "Brand", name: product.brandName },
    material: `طلای ${product.purity} عیار`,
    weight: { "@type": "QuantitativeValue", value: product.weightGrams, unitCode: "GRM" },
    offers: {
      "@type": "Offer",
      url: absoluteUrl(`/product/${product.slug}`),
      priceCurrency: "IRR",
      price: product.price * 10,
      availability: product.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      itemCondition: "https://schema.org/NewCondition",
    },
    ...(product.reviewCount && product.ratingValue
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: product.ratingValue.toFixed(1),
            reviewCount: product.reviewCount,
          },
        }
      : {}),
  };
}

export function breadcrumbJsonLd(items: { name: string; href: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.href),
    })),
  };
}

export function jsonLdScript(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}
