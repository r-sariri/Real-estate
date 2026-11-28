import { prisma } from "@/lib/db";
import { deleteCategoryAction, saveCategoryAction } from "@/actions/admin";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

const checkbox = "flex items-center gap-2 text-[12px] text-ink-soft";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { sortOrder: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="space-y-4">
      <AdminHeader title="دسته‌بندی‌ها" description="دسته‌بندی‌ها در فیلتر فروشگاه و مسیر صفحه محصول استفاده می‌شوند." />

      <Card title="دسته‌بندی جدید">
        <AdminForm action={saveCategoryAction} submitLabel="افزودن دسته‌بندی">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <Field label="نام" name="c-name" required>
              <input id="c-name" name="name" required className={inputClass} />
            </Field>
            <Field label="شناسه (اختیاری)" name="c-slug">
              <input id="c-slug" name="slug" className={inputClass} dir="ltr" />
            </Field>
            <Field label="تصویر" name="c-image">
              <input id="c-image" name="image" className={inputClass} dir="ltr" placeholder="/products/ring-classic.jpg" />
            </Field>
            <Field label="ترتیب" name="c-sort">
              <input id="c-sort" name="sortOrder" type="number" defaultValue={categories.length + 1} className={inputClass} dir="ltr" />
            </Field>
          </div>
          <Field label="توضیح" name="c-desc">
            <input id="c-desc" name="description" className={inputClass} />
          </Field>
          <label className={checkbox}>
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" />
            فعال
          </label>
        </AdminForm>
      </Card>

      <Card title={`فهرست (${categories.length})`}>
        <Table head={["نام", "شناسه", "محصولات", "وضعیت", ""]}>
          {categories.map((category) => (
            <tr key={category.id}>
              <td className="px-2 py-2">
                <details>
                  <summary className="cursor-pointer font-medium hover:text-gold-deep">{category.name}</summary>
                  <div className="mt-3 w-full max-w-xl rounded-2xl border border-line bg-cream/30 p-3">
                    <AdminForm action={saveCategoryAction} submitLabel="ذخیره">
                      <input type="hidden" name="id" value={category.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="نام" name={`n-${category.id}`}>
                          <input id={`n-${category.id}`} name="name" defaultValue={category.name} className={inputClass} />
                        </Field>
                        <Field label="شناسه" name={`s-${category.id}`}>
                          <input id={`s-${category.id}`} name="slug" defaultValue={category.slug} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="تصویر" name={`i-${category.id}`}>
                          <input id={`i-${category.id}`} name="image" defaultValue={category.image ?? ""} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="ترتیب" name={`o-${category.id}`}>
                          <input id={`o-${category.id}`} name="sortOrder" type="number" defaultValue={category.sortOrder} className={inputClass} dir="ltr" />
                        </Field>
                      </div>
                      <Field label="توضیح" name={`d-${category.id}`}>
                        <input id={`d-${category.id}`} name="description" defaultValue={category.description ?? ""} className={inputClass} />
                      </Field>
                      <label className={checkbox}>
                        <input type="checkbox" name="isActive" defaultChecked={category.isActive} className="accent-gold-deep" />
                        فعال
                      </label>
                    </AdminForm>
                  </div>
                </details>
              </td>
              <td className="px-2 py-2 text-muted" dir="ltr">{category.slug}</td>
              <td className="px-2 py-2">{category._count.products}</td>
              <td className="px-2 py-2"><Badge tone={category.isActive ? "success" : "neutral"}>{category.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton
                  action={deleteCategoryAction.bind(null, category.id)}
                  label={category._count.products > 0 ? "غیرفعال‌سازی" : "حذف"}
                  confirmText={category._count.products > 0 ? "این دسته غیرفعال شود؟" : "این دسته حذف شود؟"}
                />
              </td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
