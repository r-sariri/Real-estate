import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { formatDate } from "@/lib/format";
import { absoluteUrl } from "@/lib/seo";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buttonStyles } from "@/components/ui";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post) return { title: "مقاله یافت نشد" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt ?? undefined,
      url: absoluteUrl(`/blog/${post.slug}`),
      images: post.cover ? [{ url: post.cover }] : undefined,
      publishedTime: post.publishedAt.toISOString(),
    },
  };
}

export default async function BlogPostPage({ params }: { params: Params }) {
  const { slug } = await params;
  const post = await prisma.blogPost.findUnique({ where: { slug } });
  if (!post || !post.isPublished) notFound();

  return (
    <article className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "مجله", href: "/blog" }, { name: post.title, href: `/blog/${post.slug}` }]} />
      <div className="mx-auto max-w-3xl">
        <p className="text-[11px] text-muted">{formatDate(post.publishedAt)}</p>
        <h1 className="mt-2 text-2xl leading-snug font-semibold sm:text-3xl">{post.title}</h1>
        {post.excerpt ? <p className="mt-3 text-[13.5px] leading-8 text-ink-soft">{post.excerpt}</p> : null}
        {post.cover ? (
          <img src={post.cover} alt={post.title} width={800} height={500} className="mt-6 aspect-[8/5] w-full rounded-[2rem] border border-line object-cover" />
        ) : null}
        <div className="mt-7 space-y-4 text-[13.5px] leading-8 text-ink-soft">
          {post.body.split("\n").filter(Boolean).map((paragraph) => (
            <p key={paragraph.slice(0, 24)}>{paragraph}</p>
          ))}
        </div>
        <div className="mt-10 rounded-3xl border border-line bg-white/70 p-5 text-center">
          <p className="text-[12.5px] text-ink-soft">محصولات مرتبط را ببینید و با نرخ روز طلا خرید کنید.</p>
          <Link href="/shop" className={`${buttonStyles.gold} mt-3`}>مشاهده فروشگاه</Link>
        </div>
      </div>
    </article>
  );
}
