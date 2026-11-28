import Link from "next/link";
import { prisma } from "@/lib/db";
import { computePrice, getPricingContext } from "@/lib/pricing";
import { deleteProductAction } from "@/actions/admin";
import { formatMoney, formatPurity, formatWeight } from "@/lib/format";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, buttonStyles } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function AdminProductsPage() {
  const [products, { rateMap, pricingConfig }] = await Promise.all([
    prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      include: { category: { select: { name: true } } },
      take: 100,
    }),
    getPricingContext(),
  ]);

  return (
    <div className="space-y-4">
      <AdminHeader
        title="محصولات"
        description="مدیریت کاتالوگ، قیمت پایه، موجودی و وضعیت نمایش."
        action={
          <Link href="/admin/products/new" className={buttonStyles.primary}>
            <Icon name="plus" size={15} />
            محصول جدید
          </Link>
        }
      />

      <Card>
        <Table head={["محصول", "دسته", "عیار / وزن", "قیمت محاسبه‌شده", "موجودی", "وضعیت", ""]}>
          {products.map((product) => {
            const price = computePrice(product, rateMap, pricingConfig);
            return (
              <tr key={product.id}>
                <td className="px-2 py-2">
                  <div className="flex items-center gap-2">
                    <img src={product.images[0] ?? "/hero.jpg"} alt="" width={64} height={64} className="size-9 rounded-lg border border-line object-cover" loading="lazy" />
                    <Link href={`/admin/products/${product.id}`} className="font-medium hover:text-gold-deep">{product.name}</Link>
                  </div>
                </td>
                <td className="px-2 py-2 text-ink-soft">{product.category.name}</td>
                <td className="px-2 py-2 text-ink-soft">
                  {formatPurity(product.purity)} · {formatWeight(product.weightGrams)}
                </td>
                <td className="px-2 py-2">{formatMoney(price.finalPrice, pricingConfig.currency)}</td>
                <td className="px-2 py-2">
                  <span className={product.stock === 0 ? "text-danger" : ""}>{product.stock}</span>
                </td>
                <td className="px-2 py-2">
                  <Badge tone={product.isActive ? "success" : "neutral"}>{product.isActive ? "فعال" : "غیرفعال"}</Badge>
                  {product.isFeatured ? <Badge tone="gold" className="ms-1">ویژه</Badge> : null}
                </td>
                <td className="px-2 py-2">
                  <div className="flex items-center justify-end gap-1">
                    <Link href={`/admin/products/${product.id}`} className="rounded-full px-2.5 py-1 text-[11px] text-gold-deep hover:bg-gold-soft/50">ویرایش</Link>
                    <DeleteButton action={deleteProductAction.bind(null, product.id)} label="آرشیو" confirmText="این محصول غیرفعال شود؟" />
                  </div>
                </td>
              </tr>
            );
          })}
          {products.length === 0 ? <tr><td colSpan={7} className="px-2 py-6 text-center text-muted">محصولی ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}
