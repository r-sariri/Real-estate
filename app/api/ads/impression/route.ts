import { NextResponse } from "next/server";
import { headers } from "next/headers";
import { prisma } from "@/lib/db";
import { clientIp } from "@/lib/auth";
import { rateLimit } from "@/lib/rate-limit";

const today = () => new Date(new Date().toISOString().slice(0, 10));

/** Impression beacon (sendBeacon POST). No cookies, no user data. */
export async function POST(request: Request) {
  const h = await headers();
  if (!rateLimit(`ad-impression:${clientIp(h)}`, 120, 60_000).ok) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }

  let adId = "";
  try {
    const body = (await request.json()) as { adId?: unknown };
    adId = typeof body.adId === "string" ? body.adId.slice(0, 64) : "";
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }
  if (!adId) return NextResponse.json({ ok: false }, { status: 400 });

  const ad = await prisma.ad.findUnique({ where: { id: adId }, select: { id: true, isActive: true } });
  if (!ad || !ad.isActive) return NextResponse.json({ ok: false }, { status: 404 });

  const date = today();
  await prisma.$transaction([
    prisma.ad.update({ where: { id: adId }, data: { impressions: { increment: 1 } } }),
    prisma.adStat.upsert({
      where: { adId_date: { adId, date } },
      create: { adId, date, impressions: 1 },
      update: { impressions: { increment: 1 } },
    }),
  ]);

  return NextResponse.json({ ok: true });
}
