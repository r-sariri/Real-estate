import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

/** Readiness probe used by the Compose healthcheck. */
export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", db: "up" }, { headers: { "cache-control": "no-store" } });
  } catch {
    return NextResponse.json({ status: "degraded", db: "down" }, { status: 503, headers: { "cache-control": "no-store" } });
  }
}
