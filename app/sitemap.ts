import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories, collections, posts] = await Promise.all([
    prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.collection.findMany({ where: { isActive: true }, select: { slug: true } }),
    prisma.blogPost.findMany({ where: { isPublished: true }, select: { slug: true, publishedAt: true } }),
  ]);

  const staticPages = ["/", "/shop", "/collections", "/about", "/contact", "/blog", "/pages/shipping", "/pages/returns", "/pages/faq", "/pages/authenticity", "/pages/privacy", "/pages/terms", "/pages/pricing", "/pages/tracking"];

  return [
    ...staticPages.map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "/" ? 1 : 0.7,
    })),
    ...categories.map((category) => ({
      url: `${SITE_URL}/shop?category=${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...collections.map((collection) => ({
      url: `${SITE_URL}/collections/${collection.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...products.map((product) => ({
      url: `${SITE_URL}/product/${product.slug}`,
      lastModified: product.updatedAt,
      changeFrequency: "daily" as const,
      priority: 0.8,
    })),
    ...posts.map((post) => ({
      url: `${SITE_URL}/blog/${post.slug}`,
      lastModified: post.publishedAt,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  ];
}
