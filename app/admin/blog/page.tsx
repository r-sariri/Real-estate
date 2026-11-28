import { prisma } from "@/lib/db";
import { deleteBlogPostAction, saveBlogPostAction } from "@/actions/admin";
import { formatDate } from "@/lib/format";
import { AdminForm } from "@/components/admin/admin-form";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { DeleteButton } from "@/components/admin/delete-button";
import { Badge, Field, inputClass } from "@/components/ui";

export default async function AdminBlogPage() {
  const posts = await prisma.blogPost.findMany({ orderBy: { publishedAt: "desc" } });

  return (
    <div className="space-y-4">
      <AdminHeader title="مقالات" description="محتوای مجله زرّین برای سئو و راهنمای مشتریان." />

      <Card title="مقاله جدید">
        <AdminForm action={saveBlogPostAction} submitLabel="ایجاد مقاله">
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="عنوان" name="bl-title" required>
              <input id="bl-title" name="title" required className={inputClass} />
            </Field>
            <Field label="شناسه (اختیاری)" name="bl-slug">
              <input id="bl-slug" name="slug" className={inputClass} dir="ltr" />
            </Field>
            <Field label="تصویر کاور" name="bl-cover">
              <input id="bl-cover" name="cover" className={inputClass} dir="ltr" placeholder="/blog-1.svg" />
            </Field>
            <Field label="خلاصه" name="bl-excerpt">
              <input id="bl-excerpt" name="excerpt" className={inputClass} />
            </Field>
          </div>
          <Field label="متن مقاله" name="bl-body" hint="هر خط یک پاراگراف است">
            <textarea id="bl-body" name="body" rows={6} required className={`${inputClass} resize-y`} />
          </Field>
          <label className="flex items-center gap-2 text-[12px] text-ink-soft">
            <input type="checkbox" name="isPublished" defaultChecked className="accent-gold-deep" /> منتشر شود
          </label>
        </AdminForm>
      </Card>

      <Card title={`مقالات (${posts.length})`}>
        <Table head={["عنوان", "شناسه", "تاریخ", "وضعیت", ""]}>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className="px-2 py-2">
                <details>
                  <summary className="cursor-pointer font-medium hover:text-gold-deep">{post.title}</summary>
                  <div className="mt-2 w-full max-w-xl rounded-2xl border border-line bg-cream/30 p-3">
                    <AdminForm action={saveBlogPostAction} submitLabel="ذخیره">
                      <input type="hidden" name="id" value={post.id} />
                      <div className="grid gap-3 sm:grid-cols-2">
                        <Field label="عنوان" name={`blt-${post.id}`}>
                          <input id={`blt-${post.id}`} name="title" defaultValue={post.title} className={inputClass} />
                        </Field>
                        <Field label="شناسه" name={`bls-${post.id}`}>
                          <input id={`bls-${post.id}`} name="slug" defaultValue={post.slug} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="کاور" name={`blc-${post.id}`}>
                          <input id={`blc-${post.id}`} name="cover" defaultValue={post.cover ?? ""} className={inputClass} dir="ltr" />
                        </Field>
                        <Field label="خلاصه" name={`ble-${post.id}`}>
                          <input id={`ble-${post.id}`} name="excerpt" defaultValue={post.excerpt ?? ""} className={inputClass} />
                        </Field>
                      </div>
                      <Field label="متن" name={`blb-${post.id}`}>
                        <textarea id={`blb-${post.id}`} name="body" rows={5} defaultValue={post.body} className={`${inputClass} resize-y`} />
                      </Field>
                      <label className="flex items-center gap-2 text-[12px] text-ink-soft">
                        <input type="checkbox" name="isPublished" defaultChecked={post.isPublished} className="accent-gold-deep" /> منتشر شود
                      </label>
                    </AdminForm>
                  </div>
                </details>
              </td>
              <td className="px-2 py-2 text-muted" dir="ltr">{post.slug}</td>
              <td className="px-2 py-2 text-muted">{formatDate(post.publishedAt)}</td>
              <td className="px-2 py-2"><Badge tone={post.isPublished ? "success" : "neutral"}>{post.isPublished ? "منتشر" : "پیش‌نویس"}</Badge></td>
              <td className="px-2 py-2 text-end">
                <DeleteButton action={deleteBlogPostAction.bind(null, post.id)} confirmText="این مقاله حذف شود؟" />
              </td>
            </tr>
          ))}
          {posts.length === 0 ? <tr><td colSpan={5} className="px-2 py-6 text-center text-muted">مقاله‌ای ثبت نشده است.</td></tr> : null}
        </Table>
      </Card>
    </div>
  );
}
