import "server-only";
import { headers } from "next/headers";
import { prisma } from "./db";
import { clientIp } from "./auth";

/** Append-only trail for administrative operations. */
export async function logAudit(entry: {
  actorId?: string | null;
  action: string;
  entity: string;
  entityId?: string | null;
  meta?: Record<string, unknown>;
}): Promise<void> {
  try {
    const h = await headers();
    await prisma.auditLog.create({
      data: {
        actorId: entry.actorId ?? null,
        action: entry.action,
        entity: entry.entity,
        entityId: entry.entityId ?? null,
        meta: entry.meta ? JSON.parse(JSON.stringify(entry.meta)) : undefined,
        ip: clientIp(h).slice(0, 64),
      },
    });
  } catch (error) {
    // Auditing must never break the operation it records.
    console.error("[audit] failed", error);
  }
}
