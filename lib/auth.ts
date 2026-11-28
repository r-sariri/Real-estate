import "server-only";
import { cache } from "react";
import { cookies, headers } from "next/headers";
import { redirect } from "next/navigation";
import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import type { Role, User } from "@prisma/client";
import { prisma } from "./db";

export const SESSION_COOKIE = "zarrin_session";
const SESSION_TTL_MS = 7 * 24 * 60 * 60 * 1000;

const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");

export function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 12);
}

export function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export function clientIp(h: Headers): string {
  return (h.get("x-forwarded-for") ?? "").split(",")[0]?.trim() || h.get("x-real-ip") || "unknown";
}

export async function createSession(userId: string): Promise<void> {
  const token = randomBytes(32).toString("base64url");
  const h = await headers();
  const expiresAt = new Date(Date.now() + SESSION_TTL_MS);

  await prisma.session.create({
    data: {
      tokenHash: sha256(token),
      userId,
      expiresAt,
      ip: clientIp(h).slice(0, 64),
      userAgent: h.get("user-agent")?.slice(0, 300) ?? null,
    },
  });

  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    expires: expiresAt,
  });
}

export async function destroySession(): Promise<void> {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (token) await prisma.session.deleteMany({ where: { tokenHash: sha256(token) } });
  jar.delete(SESSION_COOKIE);
}

export type SessionUser = Pick<User, "id" | "email" | "name" | "phone" | "role" | "isBlocked">;

/** Per-request memoised current user (null when signed out). */
export const getCurrentUser = cache(async (): Promise<SessionUser | null> => {
  const jar = await cookies();
  const token = jar.get(SESSION_COOKIE)?.value;
  if (!token) return null;

  const session = await prisma.session.findUnique({
    where: { tokenHash: sha256(token) },
    select: {
      expiresAt: true,
      user: { select: { id: true, email: true, name: true, phone: true, role: true, isBlocked: true } },
    },
  });

  if (!session || session.expiresAt < new Date() || session.user.isBlocked) return null;
  return session.user;
});

export function isStaff(role: Role | undefined): boolean {
  return role === "ADMIN" || role === "STAFF";
}

export async function requireUser(nextPath = "/account"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  return user;
}

export async function requireAdmin(nextPath = "/admin"): Promise<SessionUser> {
  const user = await getCurrentUser();
  if (!user) redirect(`/login?next=${encodeURIComponent(nextPath)}`);
  if (!isStaff(user.role)) redirect("/account?denied=1");
  return user;
}

/** Best-effort brute-force lockout bookkeeping. */
export async function registerFailedLogin(userId: string): Promise<void> {
  const user = await prisma.user.update({
    where: { id: userId },
    data: { failedLogins: { increment: 1 } },
    select: { failedLogins: true },
  });
  if (user.failedLogins >= 5) {
    await prisma.user.update({
      where: { id: userId },
      data: { lockedUntil: new Date(Date.now() + 15 * 60 * 1000), failedLogins: 0 },
    });
  }
}
