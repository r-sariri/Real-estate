"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";
import { requireAdmin } from "@/lib/auth";
import { logAudit } from "@/lib/audit";
import { updateSettings } from "@/lib/settings";
import { slugify } from "@/lib/format";
import { buildSearchText } from "@/lib/search";
import type { FormState } from "@/lib/action-types";
import type { OrderStatus, Role, AdPlacement, BannerPlacement, CouponType } from "@prisma/client";

/* ---------- helpers ---------- */

const s = (fd: FormData, key: string, fallback = "") => String(fd.get(key) ?? fallback).trim();
const num = (fd: FormData, key: string, fallback = 0) => {
  const raw = String(fd.get(key) ?? "").replace(/[۰-۹]/g, (d) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(d))).replace(/[,\s]/g, "");
  const value = Number(raw);
  return Number.isFinite(value) ? value : fallback;
};
const optionalNum = (fd: FormData, key: string): number | null => {
  const raw = s(fd, key);
  if (!raw) return null;
  const value = num(fd, key, NaN);
  return Number.isFinite(value) ? value : null;
};
const bool = (fd: FormData, key: string) => {
  const value = fd.get(key);
  return value === "on" || value === "true" || value === "1";
};
const lines = (fd: FormData, key: string) =>
  s(fd, key)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

async function uniqueSlug(base: string, currentId?: string): Promise<string> {
  const root = slugify(base) || `item-${Date.now().toString(36)}`;
  let candidate = root;
  let index = 1;
  // Bounded loop; slugs are short and collisions are rare.
  while (index < 50) {
    const existing = await prisma.product.findUnique({ where: { slug: candidate }, select: { id: true } });
    if (!existing || existing.id === currentId) return candidate;
    candidate = `${root}-${index++}`;
  }
  return `${root}-${Date.now().toString(36)}`;
}

function adminPaths(...paths: string[]) {
  for (const path of paths) revalidatePath(path);
}

/* ---------- products ---------- */

export async function saveProductAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const name = s(fd, "name");
  const categoryId = s(fd, "categoryId");

  const errors: Record<string, string> = {};
  if (name.length < 2) errors.name = "نام محصول را وارد کنید.";
  if (!categoryId) errors.categoryId = "دسته‌بندی را انتخاب کنید.";
  if (num(fd, "weightGrams") <= 0) errors.weightGrams = "وزن باید بزرگ‌تر از صفر باشد.";
  if (s(fd, "description").length < 10) errors.description = "توضیحات را کامل‌تر بنویسید.";
  if (Object.keys(errors).length) return { ok: false, errors };

  const slug = s(fd, "slug") ? slugify(s(fd, "slug")) : await uniqueSlug(name, id);
  const category = await prisma.category.findUnique({ where: { id: categoryId }, select: { name: true } });

  const data = {
    slug,
    name,
    shortDescription: s(fd, "shortDescription") || null,
    description: s(fd, "description"),
    categoryId,
    searchText: buildSearchText([
      name,
      s(fd, "shortDescription"),
      s(fd, "description"),
      category?.name,
      s(fd, "specStone"),
      `${num(fd, "purity", 18)} عیار`,
    ]),
    purity: num(fd, "purity", 18),
    weightGrams: num(fd, "weightGrams"),
    makingChargePercent: num(fd, "makingChargePercent", 12),
    profitPercent: num(fd, "profitPercent", 8),
    taxPercent: num(fd, "taxPercent", 9),
    manualPrice: optionalNum(fd, "manualPrice"),
    discountPercent: Math.min(90, Math.max(0, num(fd, "discountPercent"))),
    stock: Math.max(0, num(fd, "stock")),
    isActive: bool(fd, "isActive"),
    isFeatured: bool(fd, "isFeatured"),
    isNew: bool(fd, "isNew"),
    popularity: num(fd, "popularity"),
    images: lines(fd, "images"),
    specs: {
      material: s(fd, "specMaterial") || `طلای ${num(fd, "purity", 18)} عیار`,
      stone: s(fd, "specStone") || "بدون سنگ",
      size: s(fd, "specSize") || "قابل تنظیم",
      warranty: s(fd, "specWarranty") || "گارانتی اصالت زرّین",
      madeIn: s(fd, "specMadeIn") || "ایران",
    },
    metaTitle: s(fd, "metaTitle") || null,
    metaDescription: s(fd, "metaDescription") || null,
  };

  const product = id
    ? await prisma.product.update({ where: { id }, data })
    : await prisma.product.create({ data });

  await logAudit({ actorId: admin.id, action: id ? "product.update" : "product.create", entity: "Product", entityId: product.id, meta: { name } });
  adminPaths("/admin/products", "/shop", "/", `/product/${product.slug}`);
  return { ok: true, message: id ? "محصول به‌روزرسانی شد." : "محصول ایجاد شد." };
}

export async function deleteProductAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.product.update({ where: { id }, data: { isActive: false } });
  await logAudit({ actorId: admin.id, action: "product.archive", entity: "Product", entityId: id });
  adminPaths("/admin/products", "/shop", "/");
}

/* ---------- categories & collections ---------- */

export async function saveCategoryAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const name = s(fd, "name");
  if (name.length < 2) return { ok: false, errors: { name: "نام دسته‌بندی را وارد کنید." } };

  const data = {
    name,
    slug: s(fd, "slug") ? slugify(s(fd, "slug")) : slugify(name),
    description: s(fd, "description") || null,
    image: s(fd, "image") || null,
    sortOrder: num(fd, "sortOrder"),
    isActive: bool(fd, "isActive"),
  };

  try {
    const category = id
      ? await prisma.category.update({ where: { id }, data })
      : await prisma.category.create({ data });
    await logAudit({ actorId: admin.id, action: id ? "category.update" : "category.create", entity: "Category", entityId: category.id });
  } catch {
    return { ok: false, errors: { slug: "این شناسه قبلاً استفاده شده است." } };
  }

  adminPaths("/admin/categories", "/shop", "/");
  return { ok: true, message: "دسته‌بندی ذخیره شد." };
}

export async function deleteCategoryAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  const count = await prisma.product.count({ where: { categoryId: id } });
  if (count > 0) {
    await prisma.category.update({ where: { id }, data: { isActive: false } });
    await logAudit({ actorId: admin.id, action: "category.archive", entity: "Category", entityId: id, meta: { products: count } });
  } else {
    await prisma.category.delete({ where: { id } });
    await logAudit({ actorId: admin.id, action: "category.delete", entity: "Category", entityId: id });
  }
  adminPaths("/admin/categories", "/shop");
}

export async function saveCollectionAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const name = s(fd, "name");
  if (name.length < 2) return { ok: false, errors: { name: "نام کالکشن را وارد کنید." } };

  const data = {
    name,
    slug: s(fd, "slug") ? slugify(s(fd, "slug")) : slugify(name),
    description: s(fd, "description") || null,
    image: s(fd, "image") || null,
    sortOrder: num(fd, "sortOrder"),
    isFeatured: bool(fd, "isFeatured"),
    isActive: bool(fd, "isActive"),
  };

  try {
    const collection = id
      ? await prisma.collection.update({ where: { id }, data })
      : await prisma.collection.create({ data });
    await logAudit({ actorId: admin.id, action: id ? "collection.update" : "collection.create", entity: "Collection", entityId: collection.id });
  } catch {
    return { ok: false, errors: { slug: "این شناسه قبلاً استفاده شده است." } };
  }

  adminPaths("/admin/collections", "/collections", "/");
  return { ok: true, message: "کالکشن ذخیره شد." };
}

export async function deleteCollectionAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.collection.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "collection.delete", entity: "Collection", entityId: id });
  adminPaths("/admin/collections", "/collections");
}

/* ---------- gold pricing ---------- */

export async function updatePricingAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();

  const rates: { purity: number; pricePerGram: number }[] = [];
  for (const purity of [18, 21, 24]) {
    const price = num(fd, `rate_${purity}`);
    if (price > 0) rates.push({ purity, pricePerGram: Math.round(price) });
  }
  if (rates.length === 0) return { ok: false, message: "حداقل نرخ یک عیار را وارد کنید." };

  await prisma.$transaction([
    ...rates.map((rate) =>
      prisma.goldRate.upsert({
        where: { purity: rate.purity },
        create: { ...rate, updatedById: admin.id },
        update: { pricePerGram: rate.pricePerGram, updatedById: admin.id },
      }),
    ),
    prisma.pricingConfig.upsert({
      where: { id: "singleton" },
      create: {
        id: "singleton",
        autoCalculate: bool(fd, "autoCalculate"),
        defaultMakingChargePercent: num(fd, "defaultMakingChargePercent", 12),
        defaultProfitPercent: num(fd, "defaultProfitPercent", 8),
        taxPercent: num(fd, "taxPercent", 9),
        currency: s(fd, "currency", "TOMAN"),
        lastUpdatedAt: new Date(),
        updatedById: admin.id,
      },
      update: {
        autoCalculate: bool(fd, "autoCalculate"),
        defaultMakingChargePercent: num(fd, "defaultMakingChargePercent", 12),
        defaultProfitPercent: num(fd, "defaultProfitPercent", 8),
        taxPercent: num(fd, "taxPercent", 9),
        currency: s(fd, "currency", "TOMAN"),
        lastUpdatedAt: new Date(),
        updatedById: admin.id,
      },
    }),
  ]);

  await logAudit({ actorId: admin.id, action: "pricing.update", entity: "GoldRate", meta: { rates } });
  adminPaths("/admin/pricing", "/", "/shop");
  return { ok: true, message: "نرخ طلا و تنظیمات قیمت‌گذاری به‌روزرسانی شد." };
}

/* ---------- orders ---------- */

export async function updateOrderAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "orderId");
  const status = s(fd, "status") as OrderStatus;
  const note = s(fd, "note");
  const trackingCode = s(fd, "trackingCode");

  const order = await prisma.order.findUnique({ where: { id }, select: { id: true, status: true } });
  if (!order) return { ok: false, message: "سفارش یافت نشد." };

  await prisma.$transaction([
    prisma.order.update({
      where: { id },
      data: {
        status,
        ...(trackingCode ? { trackingCode } : {}),
        ...(status === "PAID" || status === "PROCESSING" || status === "SHIPPED" || status === "DELIVERED"
          ? { paymentStatus: "PAID" as const }
          : {}),
        ...(status === "REFUNDED" ? { paymentStatus: "REFUNDED" as const } : {}),
        ...(status === "CANCELLED" ? { paymentStatus: "FAILED" as const } : {}),
      },
    }),
    prisma.orderEvent.create({ data: { orderId: id, status, note: note || null } }),
  ]);

  await logAudit({ actorId: admin.id, action: "order.status", entity: "Order", entityId: id, meta: { from: order.status, to: status } });
  adminPaths("/admin/orders", `/admin/orders/${id}`, "/account/orders");
  return { ok: true, message: "وضعیت سفارش به‌روزرسانی شد." };
}

/* ---------- customers ---------- */

export async function updateCustomerAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "userId");
  const role = s(fd, "role") as Role;
  if (id === admin.id && role !== "ADMIN") {
    return { ok: false, message: "نمی‌توانید نقش حساب خودتان را تغییر دهید." };
  }

  await prisma.user.update({ where: { id }, data: { role, isBlocked: bool(fd, "isBlocked") } });
  await logAudit({ actorId: admin.id, action: "customer.update", entity: "User", entityId: id, meta: { role } });
  adminPaths("/admin/customers");
  return { ok: true, message: "حساب مشتری به‌روزرسانی شد." };
}

/* ---------- coupons ---------- */

export async function saveCouponAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const code = s(fd, "code").toUpperCase();
  if (!/^[A-Z0-9-]{3,24}$/.test(code)) {
    return { ok: false, errors: { code: "کد باید ۳ تا ۲۴ کاراکتر انگلیسی/عدد باشد." } };
  }

  const data = {
    code,
    type: s(fd, "type", "PERCENT") as CouponType,
    value: Math.max(0, num(fd, "value")),
    minSubtotal: Math.max(0, num(fd, "minSubtotal")),
    maxUses: Math.max(0, num(fd, "maxUses")),
    isActive: bool(fd, "isActive"),
    startsAt: s(fd, "startsAt") ? new Date(s(fd, "startsAt")) : null,
    expiresAt: s(fd, "expiresAt") ? new Date(s(fd, "expiresAt")) : null,
  };

  try {
    const coupon = id
      ? await prisma.coupon.update({ where: { id }, data })
      : await prisma.coupon.create({ data });
    await logAudit({ actorId: admin.id, action: id ? "coupon.update" : "coupon.create", entity: "Coupon", entityId: coupon.id, meta: { code } });
  } catch {
    return { ok: false, errors: { code: "این کد قبلاً ثبت شده است." } };
  }

  adminPaths("/admin/coupons");
  return { ok: true, message: "کد تخفیف ذخیره شد." };
}

export async function deleteCouponAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.coupon.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "coupon.delete", entity: "Coupon", entityId: id });
  adminPaths("/admin/coupons");
}

/* ---------- banners & ads ---------- */

export async function saveBannerAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const data = {
    title: s(fd, "title"),
    subtitle: s(fd, "subtitle") || null,
    image: s(fd, "image") || null,
    ctaLabel: s(fd, "ctaLabel") || null,
    ctaUrl: s(fd, "ctaUrl") || null,
    placement: s(fd, "placement", "HOME_STRIP") as BannerPlacement,
    isActive: bool(fd, "isActive"),
    sortOrder: num(fd, "sortOrder"),
  };
  if (data.title.length < 2) return { ok: false, errors: { title: "عنوان بنر را وارد کنید." } };

  const banner = id ? await prisma.banner.update({ where: { id }, data }) : await prisma.banner.create({ data });
  await logAudit({ actorId: admin.id, action: id ? "banner.update" : "banner.create", entity: "Banner", entityId: banner.id });
  adminPaths("/admin/banners", "/");
  return { ok: true, message: "بنر ذخیره شد." };
}

export async function deleteBannerAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.banner.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "banner.delete", entity: "Banner", entityId: id });
  adminPaths("/admin/banners", "/");
}

export async function saveAdAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const targetUrl = s(fd, "targetUrl");

  const errors: Record<string, string> = {};
  if (s(fd, "title").length < 2) errors.title = "عنوان آگهی را وارد کنید.";
  if (!s(fd, "imageDesktop")) errors.imageDesktop = "تصویر دسکتاپ را وارد کنید.";
  if (!/^https?:\/\//.test(targetUrl) && !targetUrl.startsWith("/")) {
    errors.targetUrl = "نشانی مقصد باید با http(s) شروع شود یا مسیر داخلی باشد.";
  }
  if (Object.keys(errors).length) return { ok: false, errors };

  const data = {
    advertiser: s(fd, "advertiser") || null,
    title: s(fd, "title"),
    description: s(fd, "description") || null,
    imageDesktop: s(fd, "imageDesktop"),
    imageMobile: s(fd, "imageMobile") || null,
    targetUrl,
    placement: s(fd, "placement", "HOME_MIDDLE") as AdPlacement,
    priority: num(fd, "priority"),
    isActive: bool(fd, "isActive"),
    startsAt: s(fd, "startsAt") ? new Date(s(fd, "startsAt")) : null,
    endsAt: s(fd, "endsAt") ? new Date(s(fd, "endsAt")) : null,
  };

  const ad = id ? await prisma.ad.update({ where: { id }, data }) : await prisma.ad.create({ data });
  await logAudit({ actorId: admin.id, action: id ? "ad.update" : "ad.create", entity: "Ad", entityId: ad.id, meta: { placement: data.placement } });
  adminPaths("/admin/ads", "/");
  return { ok: true, message: "کمپین آگهی ذخیره شد." };
}

export async function deleteAdAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.ad.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "ad.delete", entity: "Ad", entityId: id });
  adminPaths("/admin/ads", "/");
}

/* ---------- testimonials, blog, reviews ---------- */

export async function saveTestimonialAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const data = {
    name: s(fd, "name"),
    city: s(fd, "city") || null,
    rating: Math.min(5, Math.max(1, num(fd, "rating", 5))),
    text: s(fd, "text"),
    isActive: bool(fd, "isActive"),
    sortOrder: num(fd, "sortOrder"),
  };
  if (data.name.length < 2 || data.text.length < 10) {
    return { ok: false, message: "نام و متن نظر را کامل وارد کنید." };
  }
  const row = id ? await prisma.testimonial.update({ where: { id }, data }) : await prisma.testimonial.create({ data });
  await logAudit({ actorId: admin.id, action: id ? "testimonial.update" : "testimonial.create", entity: "Testimonial", entityId: row.id });
  adminPaths("/admin/testimonials", "/");
  return { ok: true, message: "نظر مشتری ذخیره شد." };
}

export async function deleteTestimonialAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.testimonial.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "testimonial.delete", entity: "Testimonial", entityId: id });
  adminPaths("/admin/testimonials", "/");
}

export async function saveBlogPostAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const title = s(fd, "title");
  if (title.length < 3) return { ok: false, errors: { title: "عنوان مقاله را وارد کنید." } };

  const data = {
    title,
    slug: s(fd, "slug") ? slugify(s(fd, "slug")) : slugify(title),
    excerpt: s(fd, "excerpt") || null,
    body: s(fd, "body"),
    cover: s(fd, "cover") || null,
    isPublished: bool(fd, "isPublished"),
    metaTitle: s(fd, "metaTitle") || null,
    metaDescription: s(fd, "metaDescription") || null,
  };

  try {
    const post = id
      ? await prisma.blogPost.update({ where: { id }, data })
      : await prisma.blogPost.create({ data });
    await logAudit({ actorId: admin.id, action: id ? "blog.update" : "blog.create", entity: "BlogPost", entityId: post.id });
  } catch {
    return { ok: false, errors: { slug: "این شناسه قبلاً استفاده شده است." } };
  }

  adminPaths("/admin/blog", "/blog");
  return { ok: true, message: "مقاله ذخیره شد." };
}

export async function deleteBlogPostAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.blogPost.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "blog.delete", entity: "BlogPost", entityId: id });
  adminPaths("/admin/blog", "/blog");
}

export async function moderateReviewAction(id: string, approve: boolean): Promise<void> {
  const admin = await requireAdmin();
  await prisma.review.update({ where: { id }, data: { isApproved: approve } });
  await logAudit({ actorId: admin.id, action: approve ? "review.approve" : "review.reject", entity: "Review", entityId: id });
  adminPaths("/admin/reviews");
}

/* ---------- shipping & settings ---------- */

export async function saveShippingMethodAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const id = s(fd, "id") || undefined;
  const data = {
    name: s(fd, "name"),
    description: s(fd, "description") || null,
    price: Math.max(0, num(fd, "price")),
    minDays: Math.max(0, num(fd, "minDays")),
    maxDays: Math.max(0, num(fd, "maxDays")),
    isActive: bool(fd, "isActive"),
    sortOrder: num(fd, "sortOrder"),
  };
  if (data.name.length < 2) return { ok: false, errors: { name: "نام روش ارسال را وارد کنید." } };

  const row = id
    ? await prisma.shippingMethod.update({ where: { id }, data })
    : await prisma.shippingMethod.create({ data });
  await logAudit({ actorId: admin.id, action: id ? "shipping.update" : "shipping.create", entity: "ShippingMethod", entityId: row.id });
  adminPaths("/admin/settings", "/checkout");
  return { ok: true, message: "روش ارسال ذخیره شد." };
}

export async function deleteShippingMethodAction(id: string): Promise<void> {
  const admin = await requireAdmin();
  await prisma.shippingMethod.delete({ where: { id } });
  await logAudit({ actorId: admin.id, action: "shipping.delete", entity: "ShippingMethod", entityId: id });
  adminPaths("/admin/settings", "/checkout");
}

export async function saveSettingsAction(_prev: FormState, fd: FormData): Promise<FormState> {
  const admin = await requireAdmin();
  const patch: Record<string, string> = {};
  for (const key of [
    "brandName",
    "brandLatin",
    "tagline",
    "announcement",
    "phone",
    "email",
    "address",
    "instagram",
    "telegram",
    "whatsapp",
    "metaDescription",
    "shippingNote",
    "paymentGateway",
    "gatewayMerchantId",
  ]) {
    if (fd.has(key)) patch[key] = s(fd, key);
  }

  await updateSettings(patch);
  await logAudit({ actorId: admin.id, action: "settings.update", entity: "Setting", meta: { keys: Object.keys(patch) } });
  adminPaths("/admin/settings", "/", "/contact");
  return { ok: true, message: "تنظیمات سایت ذخیره شد." };
}
