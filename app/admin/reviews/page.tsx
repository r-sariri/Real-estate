import { prisma } from "@/lib/db";
import { moderateReviewAction } from "@/actions/admin";
import { formatDateTime } from "@/lib/format";
import { AdminHeader, Card, Table } from "@/components/admin/admin-ui";
import { Badge } from "@/components/ui";
import { Icon } from "@/components/icons";

export default async function AdminReviewsPage() {
  const reviews = await prisma.review.findMany({
    orderBy: [{ isApproved: "asc" }, { createdAt: "desc" }],
    take: 100,
    include: { product: { select: { name: true, slug: true } } },
  });

  const pending = reviews.filter((review) => !review.isApproved);

  return (
    <div className="space-y-4">
      <AdminHeader title="بازبینی نظرات محصول" description={`${pending.length} نظر در انتظار تأیید است.`} />

      <Card title="در انتظار تأیید">
        {pending.length === 0 ? (
          <p className="text-[12px] text-muted">نظر جدیدی در انتظار تأیید نیست.</p>
        ) : (
          <ul className="space-y-3">
            {pending.map((review) => (
              <li key={review.id} className="rounded-2xl border border-line bg-cream/30 p-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-[12px] font-medium">{review.authorName} — {review.product.name}</p>
                    <p className="text-[10.5px] text-muted">{formatDateTime(review.createdAt)} · امتیاز {review.rating}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <form action={moderateReviewAction.bind(null, review.id, true)}>
                      <button type="submit" className="flex items-center gap-1 rounded-full bg-success/10 px-3 py-1.5 text-[11px] text-success hover:bg-success/20">
                        <Icon name="check" size={12} /> تأیید
                      </button>
                    </form>
                    <form action={moderateReviewAction.bind(null, review.id, false)}>
                      <button type="submit" className="flex items-center gap-1 rounded-full bg-danger/10 px-3 py-1.5 text-[11px] text-danger hover:bg-danger/20">
                        <Icon name="close" size={12} /> رد
                      </button>
                    </form>
                  </div>
                </div>
                {review.title ? <p className="mt-2 text-[11.5px] font-medium">{review.title}</p> : null}
                <p className="mt-1 text-[11.5px] leading-6 text-ink-soft">{review.body}</p>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card title={`همه نظرات (${reviews.length})`}>
        <Table head={["محصول", "نویسنده", "امتیاز", "متن", "وضعیت", "تاریخ"]}>
          {reviews.map((review) => (
            <tr key={review.id}>
              <td className="px-2 py-2">{review.product.name}</td>
              <td className="px-2 py-2 text-ink-soft">{review.authorName}</td>
              <td className="px-2 py-2">{review.rating}</td>
              <td className="max-w-xs px-2 py-2 text-muted"><span className="line-clamp-2">{review.body}</span></td>
              <td className="px-2 py-2"><Badge tone={review.isApproved ? "success" : "gold"}>{review.isApproved ? "منتشر شده" : "در انتظار"}</Badge></td>
              <td className="px-2 py-2 text-muted">{formatDateTime(review.createdAt)}</td>
            </tr>
          ))}
        </Table>
      </Card>
    </div>
  );
}
