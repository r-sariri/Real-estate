import "server-only";
import { cache } from "react";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";
import { computePrice, getPricingContext, type PriceBreakdown } from "./pricing";
import { normalizeFa } from "./search";

export type CardProduct = {
  id: string;
  slug: string;
  name: string;
  shortDescription: string | null;
  description: string;
  purity: number;
  weightGrams: number;
  images: string[];
  stock: number;
  inStock: boolean;
  price: number;
  compareAt: number | null;
  perGram: number;
  isNew: boolean;
  discountPercent: number;
  categoryName: string;
  variants: { id: string; name: string; stock: number; priceDelta: number }[];
};

const cardSelect = {
  id: true,
  slug: true,
  name: true,
  shortDescription: true,
  description: true,
  purity: true,
  weightGrams: true,
  images: true,
  stock: true,
  isNew: true,
  discountPercent: true,
  makingChargePercent: true,
  profitPercent: true,
  taxPercent: true,
  manualPrice: true,
  popularity: true,
  createdAt: true,
  category: { select: { name: true, slug: true } },
  variants: { select: { id: true, name: true, stock: true, priceDelta: true } },
} satisfies Prisma.ProductSelect;

type CardRow = Prisma.ProductGetPayload<{ select: typeof cardSelect }>;

export function toCardProduct(row: CardRow, price: PriceBreakdown): CardProduct {
  const inStock = row.variants.length > 0 ? row.variants.some((variant) => variant.stock > 0) : row.stock > 0;
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    shortDescription: row.shortDescription,
    description: row.description,
    purity: row.purity,
    weightGrams: row.weightGrams,
    images: row.images,
    stock: row.stock,
    inStock,
    price: price.finalPrice,
    compareAt: price.discount > 0 ? price.listPrice : null,
    perGram: price.perGram,
    isNew: row.isNew,
    discountPercent: price.discountPercent,
    categoryName: row.category.name,
    variants: row.variants,
  };
}

export type CatalogFilters = {
  q?: string;
  category?: string;
  collection?: string;
  purity?: number;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
  page?: number;
  perPage?: number;
  inStockOnly?: boolean;
  featured?: boolean;
};

const MAX_SCAN = 500;

export async function searchProducts(filters: CatalogFilters) {
  const { rateMap, pricingConfig } = await getPricingContext();
  const page = Math.max(1, filters.page ?? 1);
  const perPage = Math.min(48, Math.max(1, filters.perPage ?? 12));

  const where: Prisma.ProductWhereInput = {
    isActive: true,
    ...(filters.category ? { category: { slug: filters.category } } : {}),
    ...(filters.collection ? { collections: { some: { slug: filters.collection } } } : {}),
    ...(filters.purity ? { purity: filters.purity } : {}),
    ...(filters.featured ? { isFeatured: true } : {}),
    ...(filters.q ? { searchText: { contains: normalizeFa(filters.q) } } : {}),
  };

  const rows = await prisma.product.findMany({
    where,
    select: cardSelect,
    orderBy: [{ popularity: "desc" }, { createdAt: "desc" }],
    take: MAX_SCAN,
  });

  let items = rows.map((row) => toCardProduct(row, computePrice(row, rateMap, pricingConfig)));

  if (filters.minPrice) items = items.filter((item) => item.price >= filters.minPrice!);
  if (filters.maxPrice) items = items.filter((item) => item.price <= filters.maxPrice!);
  if (filters.inStockOnly) items = items.filter((item) => item.inStock);

  switch (filters.sort) {
    case "price-asc":
      items.sort((a, b) => a.price - b.price);
      break;
    case "price-desc":
      items.sort((a, b) => b.price - a.price);
      break;
    case "popular":
      items.sort((a, b) => b.variants.length - a.variants.length);
      break;
    case "newest":
    default:
      break;
  }

  const total = items.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(page, totalPages);
  const paged = items.slice((safePage - 1) * perPage, safePage * perPage);

  return { items: paged, total, page: safePage, perPage, totalPages, currency: pricingConfig.currency };
}

export async function getFeaturedProducts(limit = 8): Promise<CardProduct[]> {
  const { rateMap, pricingConfig } = await getPricingContext();
  const rows = await prisma.product.findMany({
    where: { isActive: true, isFeatured: true },
    select: cardSelect,
    orderBy: [{ popularity: "desc" }],
    take: limit,
  });
  return rows.map((row) => toCardProduct(row, computePrice(row, rateMap, pricingConfig)));
}

export async function getNewArrivals(limit = 4): Promise<CardProduct[]> {
  const { rateMap, pricingConfig } = await getPricingContext();
  const rows = await prisma.product.findMany({
    where: { isActive: true },
    select: cardSelect,
    orderBy: [{ createdAt: "desc" }],
    take: limit,
  });
  return rows.map((row) => toCardProduct(row, computePrice(row, rateMap, pricingConfig)));
}

export const getProductBySlug = cache(async (slug: string) => {
  const { rateMap, pricingConfig } = await getPricingContext();
  const product = await prisma.product.findUnique({
    where: { slug },
    include: {
      category: true,
      variants: { orderBy: { name: "asc" } },
      collections: { select: { slug: true, name: true } },
      reviews: {
        where: { isApproved: true },
        orderBy: { createdAt: "desc" },
        take: 20,
        select: { id: true, authorName: true, rating: true, title: true, body: true, createdAt: true },
      },
    },
  });
  if (!product) return null;

  const price = computePrice(product, rateMap, pricingConfig);
  const ratingCount = product.reviews.length;
  const ratingValue = ratingCount
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / ratingCount
    : 0;

  return { product, price, ratingValue, ratingCount, currency: pricingConfig.currency, rateMap };
});

export async function getRelatedProducts(categoryId: string, excludeId: string, limit = 4): Promise<CardProduct[]> {
  const { rateMap, pricingConfig } = await getPricingContext();
  const rows = await prisma.product.findMany({
    where: { isActive: true, categoryId, id: { not: excludeId } },
    select: cardSelect,
    orderBy: [{ popularity: "desc" }],
    take: limit,
  });
  return rows.map((row) => toCardProduct(row, computePrice(row, rateMap, pricingConfig)));
}

export async function getProductsByIds(ids: string[]): Promise<CardProduct[]> {
  if (ids.length === 0) return [];
  const { rateMap, pricingConfig } = await getPricingContext();
  const rows = await prisma.product.findMany({ where: { id: { in: ids }, isActive: true }, select: cardSelect });
  const order = new Map(ids.map((id, index) => [id, index]));
  return rows
    .map((row) => toCardProduct(row, computePrice(row, rateMap, pricingConfig)))
    .sort((a, b) => (order.get(a.id) ?? 0) - (order.get(b.id) ?? 0));
}

export async function getWishlistIds(userId: string | undefined): Promise<Set<string>> {
  if (!userId) return new Set();
  const rows = await prisma.wishlistItem.findMany({ where: { userId }, select: { productId: true } });
  return new Set(rows.map((row) => row.productId));
}
