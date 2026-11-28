import "server-only";
import { cache } from "react";
import type { AdPlacement } from "@prisma/client";
import { prisma } from "./db";

/**
 * Ad serving: only campaigns that are active AND inside their schedule window.
 * Placements with nothing to show return an empty array so the UI can hide the
 * slot entirely (no empty box, no layout shift).
 */
export const getAdsFor = cache(async (placement: AdPlacement, limit = 1) => {
  const now = new Date();
  return prisma.ad.findMany({
    where: {
      placement,
      isActive: true,
      AND: [
        { OR: [{ startsAt: null }, { startsAt: { lte: now } }] },
        { OR: [{ endsAt: null }, { endsAt: { gte: now } }] },
      ],
    },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: limit,
  });
});
