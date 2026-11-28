import "server-only";
import { cookies } from "next/headers";
import { randomBytes } from "node:crypto";
import type { Prisma } from "@prisma/client";
import { prisma } from "./db";

export const CART_COOKIE = "zarrin_cart";
const THIRTY_DAYS = 60 * 60 * 24 * 30;

const cartInclude = {
  items: {
    include: { product: true, variant: true },
    orderBy: { createdAt: "asc" },
  },
} satisfies Prisma.CartInclude;

export type CartWithItems = Prisma.CartGetPayload<{ include: typeof cartInclude }>;

/** Read-only: never sets a cookie (safe in Server Components). */
export async function getCart(): Promise<CartWithItems | null> {
  const token = (await cookies()).get(CART_COOKIE)?.value;
  if (!token) return null;
  return prisma.cart.findUnique({ where: { token }, include: cartInclude });
}

/** Mutating paths only (Server Actions / Route Handlers). */
export async function ensureCart(): Promise<CartWithItems> {
  const jar = await cookies();
  const token = jar.get(CART_COOKIE)?.value;

  if (token) {
    const existing = await prisma.cart.findUnique({ where: { token }, include: cartInclude });
    if (existing) return existing;
  }

  const newToken = randomBytes(24).toString("base64url");
  const cart = await prisma.cart.create({ data: { token: newToken }, include: cartInclude });
  jar.set(CART_COOKIE, newToken, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: THIRTY_DAYS,
  });
  return cart;
}

export async function clearCart(cartId: string): Promise<void> {
  await prisma.cartItem.deleteMany({ where: { cartId } });
}

export async function cartItemCount(): Promise<number> {
  const cart = await getCart();
  return cart?.items.reduce((sum, item) => sum + item.qty, 0) ?? 0;
}
