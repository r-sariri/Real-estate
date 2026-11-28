import { prisma } from "@/lib/db";
import { deleteTestimonialAction, saveTestimonialAction } from "@/actions/admin";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminTestimonialsPage() {
  const testimonials = await prisma.testimonial.findMany({ orderBy: { sortOrder: "asc" } });

  return (
    <div className="space-y-4">
      <AdminHeader title="نظرات مشتریان" description="بخش «تجربه مشتریان» در صفحه اصلی از این فهرست خوانده می‌شود." />

      <Card title="نظر جدید">
        <AdminForm action={saveTestimonialAction} submitLabel="افزودن نظر">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="نام" name="t-name" required>
              <input id="t-name" name="name" required className={inputClass} />
            </Field>
            <Field label="شهر" name="t-city">
              <input id="t-city" name="city" className={inputClass} />
            </Field>
            <Field label="امتیاز (۱ تا ۵)" name="t-rating">
              <input id="t-rating" name="rating" type="number" min="1" max="5" defaultValue={5} className={inputClass} dir="ltr" />
            </Field>
            <Field label="ترتیب" name="t-sort">
              <input id="t-sort" name="sortOrder" type="number" defaultValue={testimonials.length + 1} className={inputClass} dir="ltr" />
            </Field>
          </div>
          <Field label="متن نظر" name="t-text" required>
            <textarea id="t-text" name="text" rows={3} required className={`${inputClass} resize-y`} />
          </Field>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isActive" defaultChecked className="accent-gold-deep" /> نمایش در سایت
          </label>
        </AdminForm>
      </Card>

      <Card title={`نظرات (${testimonials.length})`}>
        <Table head={["نام", "شهر", "امتیاز", "متن", "وضعیت", ""]}>
          {testimonials.map((item) => (
            <tr key={item.id}>
              <td className="px-2 py-2 font-medium">{item.name}</td>
              <td className="px-2 py-2 text-muted">{item.city ?? "—"}</td>
              <td className="px-2 py-2">{item.rating}</td>
              <td className="max-w-xs px-2 py-2 text-muted"><span className="line-clamp-2">{item.text}</span></td>
              <td className="px-2 py-2"><Badge tone={item.isActive ? "success" : "neutral"}>{item.isActive ? "فعال" : "غیرفعال"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteTestimonialAction.bind(null, item.id)} confirmText="این نظر حذف شود؟" />
              </td>
            </tr>
          ))}
          {testimonials.length === 0 ? <tr><td colSpan={6} className="px-2 py-6 text-center text-muted">نظری ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}
