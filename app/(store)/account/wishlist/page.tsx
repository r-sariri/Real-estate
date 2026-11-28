import Link from "next/link";
import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { getProductsByIds } from "@/lib/catalog";
import { ProductCard } from "@/components/product-card";
import { EmptyState, buttonStyles } from "@/components/ui";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها", robots: { index: false, follow: false } };

export default async function WishlistPage() {
  const user = await requireUser("/account/wishlist");
  const rows = await prisma.wishlistItem.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    select: { productId: true },
  });
  const products = await getProductsByIds(rows.map((row) => row.productId));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">علاقه‌مندی‌ها</h1>
        <span className="text-[11.5px] text-muted">{products.length} قطعه</span>
      </div>

      {products.length === 0 ? (
        <EmptyState
          icon="heart"
          title="لیست علاقه‌مندی‌ها خالی است"
          description="روی آیکون قلب هر محصول بزنید تا برای بعد ذخیره شود."
          action={<Link href="/shop" className={buttonStyles.gold}>مشاهده محصولات</Link>}
        />
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} wishlisted />
          ))}
        </div>
      )}
    </div>
  );
}
