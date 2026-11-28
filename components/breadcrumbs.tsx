import Link from "next/link";
import { breadcrumbJsonLd, jsonLdScript } from "@/lib/seo";
import { Icon } from "./icons";

export function Breadcrumbs({ items }: { items: { name: string; href: string }[] }) {
  const trail = [{ name: "خانه", href: "/" }, ...items];
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(breadcrumbJsonLd(trail))} />
      <nav aria-label="مسیر صفحه" className="mb-5">
        <ol className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          {trail.map((item, index) => {
            const last = index === trail.length - 1;
            return (
              <li key={item.href} className="flex items-center gap-1.5">
                {index > 0 ? <Icon name="chevronLeft" size={11} className="opacity-50" /> : null}
                {last ? (
                  <span aria-current="page" className="text-ink-soft">{item.name}</span>
                ) : (
                  <Link href={item.href} className="hover:text-gold-deep">{item.name}</Link>
                )}
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}
