import { prisma } from "@/lib/db";
import { deleteCollectionAction, saveCollectionAction } from "@/actions/admin";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminCollectionsPage() {
  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-4">
      <AdminHeader title="کالکشن‌ها" description="کالکشن‌های ویژه صفحه اصلی و صفحه کالکشن‌ها." />

      <Card title="کالکشن جدید">
        <AdminForm action={saveCollectionAction} submitLabel="افزودن کالکشن">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="نام" name="col-name" required>
              <input id="col-name" name="name" required className={inputClass} />
            </Field>
            <Field label="شناسه (اختیاری)" name="col-slug">
              <input id="col-slug" name="slug" className={inputClass} dir="ltr" />
            </Field>
            <Field label="تصویر" name="col-image">
              <input id="col-image" name="image" className={inputClass} dir="ltr" placeholder="/products/necklace-drop.jpg" />
            </Field>
            <Field label="ترتیب" name="col-sort">
              <input id="col-sort" name="sortOrder" type="number" defaultValue={collections.length + 1} className={inputClass} dir="ltr" />
            </Field>
          </div>
          <Field label="توضیح" name="col-desc">
            <input id="col-desc" name="description" className={inputClass} />
          </Field>
          <div className="flex gap-4">
            <label className="flex items-center gap-2 text-[12px] text-ink-soft">
              <input type="checkbox" name="isFeatured" defaultChecked className="accent-gold-deep" /> نمایش در صفحه اصلی
            </label>
            <label className="flex items-center gap-2 text-[12px] text-ink-soft">
              <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> فعال
            </label>
          </div>
        </AdminForm>
      </Card>

      <Card title={`فهرست (${collections.length})`}>
        <Table head={["نام", "شناسه", "محصولات", "صفحه اصلی", "وضعیت", ""]}>
          {collections.map((collection) => (
            <tr key={collection.id}>
              <td className="px-2 py-2">
                <details>
                  <summary className="cursor-pointer font-medium hover:text-gold-deep">{collection.name}</summary>
                  <div className="mt-3 w-full max-w-xl rounded-2xl border border-line bg-cream/30 p-3">
                    <AdminForm action={saveCollectionAction} submitLabel="ذخیره">
                      <input type="hidden" name="id" value={collection.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="نام" name={`cn-${collection.id}`}>
                          <input id={`cn-${collection.id}`} name="name" defaultValue={collection.name} className={inputClass} />
                        </Field>
                        <Field label="شناسه" name={`cs-${collection.id}`}>
                          <input id={`cs-${collection.id}`} name="slug" defaultValue={collection.slug} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="تصویر" name={`ci-${collection.id}`}>
                          <input id={`ci-${collection.id}`} name="image" defaultValue={collection.image ?? ""} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="ترتیب" name={`co-${collection.id}`}>
                          <input id={`co-${collection.id}`} name="sortOrder" type="number" defaultValue={collection.sortOrder} className={inputClass} dir="ltr" />
                        </Field>
                      </div>
                      <Field label="توضیح" name={`cd-${collection.id}`}>
                        <input id={`cd-${collection.id}`} name="description" defaultValue={collection.description ?? ""} className={inputClass} />
                      </Field>
                      <div className="flex gap-4">
                        <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                          <input type="checkbox" name="isFeatured" defaultChecked={collection.isFeatured} className="accent-gold-deep" /> صفحه اصلی
                        </label>
                        <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                          <input type="checkbox" name="isActive" defaultChecked={collection.isActive} className="accent-gold-deep" /> فعال
                        </label>
                      </div>
                    </AdminForm>
                  </div>
                </details>
              </td>
              <td className="px-2 py-2 text-muted" dir="ltr">{collection.slug}</td>
              <td className="px-2 py-2">{collection._count.products}</td>
              <td className="px-2 py-2">{collection.isFeatured ? "بله" : "خیر"}</td>
              <td className="px-2 py-2"><Badge tone={collection.isActive ? "success" : "neutral"}>{collection.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteCollectionAction.bind(null, collection.id)} confirmText="این کالکشن حذف شود؟" />
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
