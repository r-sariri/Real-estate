import type { Metadata } from "next";
import { prisma } from "@/lib/db";
import { requireUser } from "@/lib/auth";
import { deleteAddressAction } from "@/actions/account";
import { AddressForm } from "@/components/address-form";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

export const metadata: Metadata = { title: "نشانی‌های من", robots: { index: false, follow: false } };

export default async function AddressesPage() {
  const user = await requireUser("/account/addresses");
  const addresses = await prisma.address.findMany({
    where: { userId: user.id },
    orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
  });

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <h1 className="text-lg font-semibold">نشانی‌های من</h1>
        <span className="text-[11.5px] text-muted">{addresses.length} نشانی</span>
      </div>

      {addresses.length > 0 ? (
        <ul className="space-y-3">
          {addresses.map((address) => (
            <li key={address.id} className="rounded-3xl border border-line bg-white/70 p-4">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <p className="flex items-center gap-2 text-[12.5px] font-medium">
                    {address.fullName}
                    {address.isDefault ? <Badge tone="gold">پیش‌فرض</Badge> : null}
                    {address.label ? <span className="text-[10.5px] text-muted">({address.label})</span> : null}
                  </p>
                  <p className="mt-1 text-[11.5px] leading-6 text-ink-soft">
                    {address.province}، {address.city}، {address.line1} — کد پستی {address.postalCode}
                  </p>
                  <p className="text-[11px] text-muted" dir="ltr">{address.phone}</p>
                </div>
                <form action={deleteAddressAction}>
                  <input type="hidden" name="id" value={address.id} />
                  <button type="submit" className="grid size-8 place-items-center rounded-full text-muted hover:bg-danger/10 hover:text-danger" aria-label="حذف نشانی">
                    <Icon name="trash" size={15} />
                  </button>
                </form>
              </div>

              <details className="mt-3 border-t border-line pt-3">
                <summary className="cursor-pointer text-[11.5px] text-gold-deep">ویرایش این نشانی</summary>
                <div className="mt-3">
                  <AddressForm
                    address={{
                      id: address.id,
                      label: address.label,
                      fullName: address.fullName,
                      phone: address.phone,
                      province: address.province,
                      city: address.city,
                      postalCode: address.postalCode,
                      line1: address.line1,
                      isDefault: address.isDefault,
                    }}
                  />
                </div>
              </details>
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-2xl border border-dashed border-line bg-white/60 px-4 py-8 text-center text-[12.5px] text-muted">
          هنوز نشانی ثبت نکرده‌اید.
        </p>
      )}

      <section className="rounded-3xl border border-line bg-white/70 p-5">
        <h2 className="mb-4 text-sm font-semibold">افزودن نشانی جدید</h2>
        <AddressForm />
      </section>
    </div>
  );
}
