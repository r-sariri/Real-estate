import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { clientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

/**
 * Tracked click-through: counts the click, then redirects to the campaign
 * destination. Only http(s) and same-site paths are allowed (no open redirect).
 */
export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const h = await headers();
  const fallback = new URL("/", request.url);

  if (!rateLimit(`ad-click:${clientIp(h)}`, 60, 60_000).ok) {
    return NextResponse.redirect(fallback, 302);
  }

  const ad = await prisma.ad.findUnique({ where: { id }, select: { id: true, targetUrl: true, isActive: true } });
  if (!ad || !ad.isActive) return NextResponse.redirect(fallback, 302);

  const date = new Date(new Date().toISOString().slice(0, 10));
  await prisma.$transaction([
    prisma.ad.update({ where: { id }, data: { clicks: { increment: 1 } } }),
    prisma.adStat.upsert({
      where: { adId_date: { adId: id, date } },
      create: { adId: id, date, clicks: 1 },
      update: { clicks: { increment: 1 } },
    }),
  ]);

  const target = ad.targetUrl.trim();
  if (/^https?:\/\//i.test(target)) {
    return NextResponse.redirect(target, 302);
  }
  if (target.startsWith("/") && !target.startsWith("//")) {
    return NextResponse.redirect(new URL(target, request.url), 302);
  }
  return NextResponse.redirect(fallback, 302);
}
