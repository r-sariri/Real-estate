import { getCurrentUser, isStaff } from "@/lib/auth";
import { cartItemCount } from "@/lib/cart";
import { prisma } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import { HeaderShell } from "./header-shell";

export async function SiteHeader() {
  const [settings, user, cartCount] = await Promise.all([getSettings(), getCurrentUser(), cartItemCount()]);
  const wishlistCount = user
    ? await prisma.wishlistItem.count({ where: { userId: user.id } })
    : 0;

  return (
    <HeaderShell
      brandName={settings.brandName}
      brandLatin={settings.brandLatin}
      announcement={settings.announcement}
      userName={user?.name ?? null}
      isAdmin={isStaff(user?.role)}
      cartCount={cartCount}
      wishlistCount={wishlistCount}
    />
  );
}
