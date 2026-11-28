import type { Metadata } from "next";
import Link from "next/link";
import { prisma } from "@/lib/db";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { CollectionCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { EmptyState, buttonStyles } from "@/components/ui";

export const metadata: Metadata = {
  title: "کالکشن‌های زرّین",
  description: "کالکشن‌های دست‌ساز زرّین: گردنبند، انگشتر، گوشواره، دستبند، جواهرات عروس و الماس.",
  alternates: { canonical: "/collections" },
};

export default async function CollectionsPage() {
  const collections = await prisma.collection.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" },
    select: { slug: true, name: true, description: true, image: true, _count: { select: { products: true } } },
  });

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "کالکشن‌ها", href: "/collections" }]} />
      <header className="mb-8 max-w-2xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">کالکشن‌های زرّین</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-ink-soft">
          هر کالکشن با یک ایده شروع شده و با دست ساخته می‌شود؛ از قطعات مینیمال روزمره تا ست‌های عروس.
        </p>
      </header>

      {collections.length === 0 ? (
        <EmptyState
          icon="diamond"
          title="کالکشنی منتشر نشده است"
          description="به‌زودی کالکشن‌های جدید در این صفحه نمایش داده می‌شوند."
          action={<Link href="/shop" className={buttonStyles.outline}>مشاهده همه محصولات</Link>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collections.map((collection, index) => (
            <Reveal key={collection.slug} delay={index * 50}>
              <CollectionCard collection={collection} count={collection._count.products} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
