import type { ReactNode } from "react";
import { Icon } from "../icons";

export function AdminHeader({ title, description, action }: { title: string; description?: string; action?: ReactNode }) {
  return (
    <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="text-lg font-semibold sm:text-xl">{title}</h1>
        {description ? <p className="mt-1 text-[12px] text-muted">{description}</p> : null}
      </div>
      {action}
    </header>
  );
}

export function Card({
  title,
  description,
  children,
  className = "",
  action,
}: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
  action?: ReactNode;
}) {
  return (
    <section className={`rounded-3xl border border-line bg-white/75 p-5 ${className}`}>
      {title ? (
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <div>
            <h2 className="text-[13px] font-semibold">{title}</h2>
            {description ? <p className="mt-0.5 text-[11px] text-muted">{description}</p> : null}
          </div>
          {action}
        </div>
      ) : null}
      {children}
    </section>
  );
}

export function Stat({
  label,
  value,
  hint,
  icon,
  tone = "neutral",
}: {
  label: string;
  value: string;
  hint?: string;
  icon: React.ComponentProps<typeof Icon>["name"];
  tone?: "neutral" | "gold" | "success";
}) {
  const tones = {
    neutral: "bg-ice/60 text-ink-soft",
    gold: "bg-gold-soft text-gold-deep",
    success: "bg-success/10 text-success",
  } as const;
  return (
    <div className="rounded-2xl border border-line bg-white/75 p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-muted">{label}</span>
        <span className={`grid size-7 place-items-center rounded-full ${tones[tone]}`}>
          <Icon name={icon} size={14} />
        </span>
      </div>
      <p className="mt-2 text-lg font-semibold">{value}</p>
      {hint ? <p className="mt-0.5 text-[10.5px] text-muted">{hint}</p> : null}
    </div>
  );
}

/** Form without a client wrapper (delete/toggle actions that only revalidate). */
export function ActionForm({ action, children, className = "" }: { action: () => Promise<void>; children: ReactNode; className?: string }) {
  return (
    <form action={action} className={className}>
      {children}
    </form>
  );
}

export function Table({ head, children }: { head: string[]; children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[560px] border-collapse text-[12px]">
        <thead>
          <tr className="border-b border-line text-start text-[10.5px] tracking-wide text-muted">
            {head.map((cell) => (
              <th key={cell} scope="col" className="px-2 py-2 text-start font-medium">
                {cell}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">{children}</tbody>
      </table>
    </div>
  );
}
