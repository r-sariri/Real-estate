import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { searchProducts, getWishlistIds } from "@/lib/catalog";
import { getCurrentUser } from "@/lib/auth";
import { digitsToLatin } from "@/lib/format";
import { ProductCard } from "@/components/product-card";
import { AdSlot } from "@/components/ad-slot";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { SortSelect } from "@/components/sort-select";
import { FilterPanel } from "@/components/filter-panel";
import { EmptyState, Pagination, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";
import Link from "next/link";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const first = (value: string | string[] | undefined) => (Array.isArray(value) ? value[0] : value);

export async function generateMetadata({ searchParams }: { searchParams: SearchParams }): Promise<Metadata> {
  const sp = await searchParams;
  const q = first(sp.q);
  const category = first(sp.category);
  const cat = category ? await prisma.category.findUnique({ where: { slug: category }, select: { name: true } }) : null;

  const title = q ? `جستجو برای «${q}»` : cat ? cat.name : "فروشگاه جواهرات طلا";
  return {
    title,
    description: cat?.name
      ? `${cat.name} دست‌ساز زرّین با طلای ۱۸ عیار، گواهی اصالت و ارسال بیمه‌شده.`
      : "خرید آنلاین گردنبند، انگشتر، گوشواره و دستبند طلا با نرخ روز و اجرت شفاف.",
    alternates: { canonical: category ? `/shop?category=${category}` : "/shop" },
    robots: q ? { index: false, follow: true } : undefined,
  };
}

export default async function ShopPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = first(sp.q)?.trim();
  const category = first(sp.category);
  const purity = Number(first(sp.purity) ?? "") || undefined;
  const minPrice = Number(digitsToLatin(first(sp.minPrice) ?? "")) || undefined;
  const maxPrice = Number(digitsToLatin(first(sp.maxPrice) ?? "")) || undefined;
  const sort = first(sp.sort) ?? "newest";
  const page = Number(first(sp.page) ?? 1) || 1;
  const inStockOnly = first(sp.inStock) === "1";

  const [categories, user] = await Promise.all([
    prisma.category.findMany({ where: { isActive: true }, orderBy: { sortOrder: "asc" } }),
    getCurrentUser(),
  ]);

  const result = await searchProducts({ q, category, purity, minPrice, maxPrice, sort, page, inStockOnly, perPage: 12 });
  const wishlist = await getWishlistIds(user?.id);
  const activeCategory = categories.find((item) => item.slug === category);

  const buildHref = (nextPage: number) => {
    const params = new URLSearchParams();
    if (q) params.set("q", q);
    if (category) params.set("category", category);
    if (purity) params.set("purity", String(purity));
    if (minPrice) params.set("minPrice", String(minPrice));
    if (maxPrice) params.set("maxPrice", String(maxPrice));
    if (sort) params.set("sort", sort);
    if (inStockOnly) params.set("inStock", "1");
    params.set("page", String(nextPage));
    return `/shop?${params.toString()}`;
  };

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: "فروشگاه", href: "/shop" }, ...(activeCategory ? [{ name: activeCategory.name, href: `/shop?category=${activeCategory.slug}` }] : [])]} />

      <header className="mb-7">
        <h1 className="text-2xl font-semibold sm:text-3xl">
          {q ? `نتایج جستجو برای «${q}»` : activeCategory ? activeCategory.name : "همه جواهرات"}
        </h1>
        <p className="mt-2 text-[13px] text-ink-soft">
          {activeCategory?.description ?? "قیمت‌ها بر اساس نرخ روز طلا، وزن و اجرت ساخت محاسبه و به‌صورت شفاف نمایش داده می‌شوند."}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[255px_1fr] lg:gap-8">
        {/* Filters */}
        <aside aria-label="فیلترها">
          <FilterPanel>
            <form method="get" action="/shop" className="space-y-5">
              {q ? <input type="hidden" name="q" value={q} /> : null}
              <input type="hidden" name="sort" value={sort} />

              <fieldset>
                <legend className="mb-2 text-xs font-medium text-ink-soft">دسته‌بندی</legend>
                <div className="space-y-1.5">
                  <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-soft">
                    <input type="radio" name="category" value="" defaultChecked={!category} className="accent-gold-deep" />
                    همه
                  </label>
                  {categories.map((item) => (
                    <label key={item.id} className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-soft">
                      <input type="radio" name="category" value={item.slug} defaultChecked={category === item.slug} className="accent-gold-deep" />
                      {item.name}
                    </label>
                  ))}
                </div>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-xs font-medium text-ink-soft">عیار</legend>
                <div className="flex flex-wrap gap-1.5">
                  {[18, 21, 24].map((karat) => (
                    <label
                      key={karat}
                      className={`cursor-pointer rounded-full border px-3 py-1.5 text-[11.5px] transition-colors ${
                        purity === karat ? "border-ink bg-ink text-pearl" : "border-line bg-white text-ink-soft hover:border-gold"
                      }`}
                    >
                      <input type="radio" name="purity" value={karat} defaultChecked={purity === karat} className="sr-only" />
                      {karat} عیار
                    </label>
                  ))}
                </div>
                <p className="mt-2 text-[10.5px] text-muted">برای حذف فیلتر عیار، «همه» را در دسته‌بندی انتخاب و فیلتر را اعمال کنید.</p>
              </fieldset>

              <fieldset>
                <legend className="mb-2 text-xs font-medium text-ink-soft">محدوده قیمت (تومان)</legend>
                <div className="flex items-center gap-2">
                  <input
                    name="minPrice"
                    inputMode="numeric"
                    defaultValue={minPrice ?? ""}
                    placeholder="حداقل"
                    aria-label="حداقل قیمت"
                    className="w-full rounded-xl border border-line bg-white px-2.5 py-2 text-[12px] focus:border-gold focus:outline-none"
                  />
                  <span className="text-muted">—</span>
                  <input
                    name="maxPrice"
                    inputMode="numeric"
                    defaultValue={maxPrice ?? ""}
                    placeholder="حداکثر"
                    aria-label="حداکثر قیمت"
                    className="w-full rounded-xl border border-line bg-white px-2.5 py-2 text-[12px] focus:border-gold focus:outline-none"
                  />
                </div>
              </fieldset>

              <label className="flex cursor-pointer items-center gap-2 text-[12.5px] text-ink-soft">
                <input type="checkbox" name="inStock" value="1" defaultChecked={inStockOnly} className="accent-gold-deep" />
                فقط کالاهای موجود
              </label>

              <div className="flex gap-2 pt-1">
                <button type="submit" className={`${buttonStyles.primary} flex-1 px-4 py-2.5 text-xs`}>
                  اعمال فیلتر
                </button>
                <Link href="/shop" className={`${buttonStyles.outline} px-4 py-2.5 text-xs`}>
                  پاک کردن
                </Link>
              </div>
            </form>
          </FilterPanel>

          <div className="mt-4 hidden lg:block">
            <AdSlot placement="SIDEBAR" ratio="tall" />
          </div>
        </aside>

        {/* Results */}
        <div>
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line bg-white/60 px-4 py-2.5">
            <p className="text-[12px] text-muted">
              <span className="font-medium text-ink">{result.total}</span> محصول
            </p>
            <SortSelect value={sort} />
          </div>

          {result.items.length === 0 ? (
            <EmptyState
              icon="search"
              title="محصولی با این مشخصات پیدا نشد"
              description="عبارت جستجو یا فیلترها را تغییر دهید. می‌توانید همه محصولات را ببینید."
              action={
                <Link href="/shop" className={buttonStyles.outline}>
                  نمایش همه محصولات
                </Link>
              }
            />
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
                {result.items.map((product) => (
                  <ProductCard key={product.id} product={product} wishlisted={wishlist.has(product.id)} currency={result.currency} />
                ))}
              </div>
              <Pagination page={result.page} totalPages={result.totalPages} buildHref={buildHref} />
            </>
          )}

          <div className="mt-8 lg:hidden">
            <AdSlot placement="PRODUCT_LIST" ratio="wide" />
          </div>
        </div>
      </div>
    </div>
  );
}
