"use client";

import { Icon } from "../icons";

/** Destructive submit with a confirmation step. */
export function DeleteButton({
  action,
  label = "حذف",
  confirmText = "این مورد حذف شود؟",
}: {
  action: () => Promise<void>;
  label?: string;
  confirmText?: string;
}) {
  return (
    <form
      action={action}
      onSubmit={(event) => {
        if (!window.confirm(confirmText)) event.preventDefault();
      }}
      className="inline"
    >
      <button
        type="submit"
        className="rounded-full px-2.5 py-1 text-[11px] text-muted transition-colors hover:bg-danger/10 hover:text-danger"
      >
        <span className="flex items-center gap-1">
          <Icon name="trash" size={12} />
          {label}
        </span>
      </button>
    </form>
  );
}
