import type { OrderStatus, PaymentStatus } from "@prisma/client";

export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  PENDING: "در انتظار پرداخت",
  PAID: "پرداخت شده",
  PROCESSING: "در حال آماده‌سازی",
  SHIPPED: "ارسال شده",
  DELIVERED: "تحویل شده",
  CANCELLED: "لغو شده",
  REFUNDED: "مرجوع شده",
};

export const ORDER_STATUS_TONE: Record<OrderStatus, "neutral" | "gold" | "success" | "danger" | "ice"> = {
  PENDING: "gold",
  PAID: "ice",
  PROCESSING: "ice",
  SHIPPED: "ice",
  DELIVERED: "success",
  CANCELLED: "danger",
  REFUNDED: "danger",
};

export const PAYMENT_STATUS_LABELS: Record<PaymentStatus, string> = {
  UNPAID: "پرداخت نشده",
  PAID: "پرداخت شده",
  FAILED: "ناموفق",
  REFUNDED: "بازگشت داده شده",
};

export const ORDER_STATUS_FLOW: OrderStatus[] = ["PENDING", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

export function orderProgress(status: OrderStatus): number {
  if (status === "CANCELLED" || status === "REFUNDED") return 0;
  const index = ORDER_STATUS_FLOW.indexOf(status);
  return index < 0 ? 0 : Math.round(((index + 1) / ORDER_STATUS_FLOW.length) * 100);
}
