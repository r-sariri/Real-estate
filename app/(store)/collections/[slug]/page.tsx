import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { searchProducts, getWishlistIds } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { absoluteUrl } from "@/lib/seo";
import { ProductCard } from "@/components/product-card";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { EmptyState, buttonStyles } from "@/components/ui";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection) return { title: "کالکشن یافت نشد" };
  return {
    title: collection.name,
    description: collection.description ?? `${collection.name} — کالکشن دست‌ساز زرّین با طلای ۱۸ عیار.`,
    alternates: { canonical: `/collections/${collection.slug}` },
    openGraph: { title: collection.name, images: collection.image ? [{ url: collection.image }] : undefined, url: absoluteUrl(`/collections/${collection.slug}`) },
  };
}

export default async function CollectionPage({ params }: { params: Params }) {
  const { slug } = await params;
  const collection = await prisma.collection.findUnique({ where: { slug } });
  if (!collection || !collection.isActive) notFound();

  const [result, user] = await Promise.all([
    searchProducts({ collection: slug, perPage: 24, sort: "newest" }),
    getCurrentUser(),
  ]);
  const wishlist = await getWishlistIds(user?.id);

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "کالکشن‌ها", href: "/collections" }, { name: collection.name, href: `/collections/${collection.slug}` }]} />

      <header className="relative mb-8 overflow-hidden rounded-[2rem] border border-line bg-gradient-to-l from-gold-soft/60 via-white to-ice/50 p-6 sm:p-10">
        <div className="relative max-w-2xl">
          <p className="text-[11px] tracking-[0.22em] text-gold-deep uppercase">کالکشن</p>
          <h1 className="mt-2 text-2xl font-semibold sm:text-4xl">{collection.name}</h1>
          {collection.description ? <p className="mt-3 text-[13.5px] leading-7 text-ink-soft">{collection.description}</p> : null}
          <p className="mt-4 text-[12px] text-muted">{result.total} قطعه در این کالکشن</p>
        </div>
      </header>

      {result.items.length === 0 ? (
        <EmptyState
          icon="diamond"
          title="این کالکشن در حال آماده‌سازی است"
          description="قطعات این کالکشن به‌زودی منتشر می‌شوند."
          action={<Link href="/shop" className={buttonStyles.outline}>مشاهده همه محصولات</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {result.items.map((product) => (
            <ProductCard key={product.id} product={product} wishlisted={wishlist.has(product.id)} currency={result.currency} />
          ))}
        </div>
      )}

      <div className="mt-10">
        <AdSlot placement="CATEGORY" ratio="wide" />
      </div>
    </div>
  );
}
