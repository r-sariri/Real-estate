import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { STATIC_PAGES } from "@/lib/pages-content";
import { Breadcrumbs } from "@/components/breadcrumbs";
import { buttonStyles } from "@/components/ui";

type Params = Promise<{ slug: string }>;

export function generateStaticParams() {
  return STATIC_PAGES.map((page) => ({ slug: page.slug }));
}

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const page = STATIC_PAGES.find((item) => item.slug === slug);
  if (!page) return { title: "صفحه یافت نشد" };
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: `/pages/${page.slug}` },
  };
}

export default async function StaticInfoPage({ params }: { params: Params }) {
  const { slug } = await params;
  const page = STATIC_PAGES.find((item) => item.slug === slug);
  if (!page) notFound();

  return (
    <div className="container-lux py-8 sm:py-10">
      <Breadcrumbs items={[{ name: page.title, href: `/pages/${page.slug}` }]} />
      <div className="mx-auto max-w-3xl">
        <h1 className="text-2xl font-semibold sm:text-3xl">{page.title}</h1>
        <p className="mt-3 text-[13.5px] leading-7 text-ink-soft">{page.description}</p>

        <div className="mt-8 space-y-6">
          {page.sections.map((section) => (
            <section key={section.heading} className="rounded-3xl border border-line bg-white/70 p-5">
              <h2 className="text-[14px] font-semibold">{section.heading}</h2>
              <div className="mt-2 space-y-2 text-[12.5px] leading-7 text-ink-soft">
                {section.body.map((paragraph) => (
                  <p key={paragraph.slice(0, 20)}>{paragraph}</p>
                ))}
              </div>
            </section>
          ))}
        </div>

        <div className="mt-8 flex flex-wrap gap-2">
          <Link href="/contact" className={buttonStyles.primary}>سؤال دیگری دارم</Link>
          <Link href="/shop" className={buttonStyles.outline}>مشاهده محصولات</Link>
        </div>
      </div>
    </div>
  );
}
