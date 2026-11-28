import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState } from "@/components/ui";

export const metadata: Metadata = {
  title: "مجله زرّین",
  description: "مقالات تخصصی درباره طلا، عیار، نگهداری جواهرات و راهنمای خرید.",
  alternates: { canonical: "/blog" },
};

export default async function BlogPage() {
  const posts = await prisma.blogPost.findMany({
    where: { isPublished: true },
    orderBy: { publishedAt: "desc" },
    select: { slug: true, title: true, excerpt: true, cover: true, publishedAt: true },
  });

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "مجله زرّین", href: "/blog" }]} />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">مجله زرّین</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-ink-soft">
          راهنماهای کوتاه و کاربردی برای انتخاب، نگهداری و شناخت طلا و جواهرات.
        </p>
      </header>

      {posts.length === 0 ? (
        <EmptyState icon="image" title="هنوز مقاله‌ای منتشر نشده است" description="به‌زودی مطالب تازه در این بخش قرار می‌گیرد." />
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article key={post.slug} className="group overflow-hidden rounded-[1.75rem] border border-line bg-white/70 transition-all hover:-translate-y-1 hover:shadow-lift">
              <Link href={`/blog/${post.slug}`} className="block">
                <img
                  src={post.cover ?? "/blog-1.svg"}
                  alt={post.title}
                  width={800}
                  height={500}
                  loading="lazy"
                  className="aspect-[8/5] w-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </Link>
              <div className="p-4">
                <p className="text-[10.5px] text-muted">{formatDate(post.publishedAt)}</p>
                <h2 className="mt-1.5 text-[14px] font-semibold leading-6">
                  <Link href={`/blog/${post.slug}`} className="hover:text-gold-deep">{post.title}</Link>
                </h2>
                {post.excerpt ? <p className="mt-1.5 line-clamp-2 text-[11.5px] leading-6 text-ink-soft">{post.excerpt}</p> : null}
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
