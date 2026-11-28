import type { NextConfig } from "next";

/**
 * Sandbox preview overrides.
 *
 * The Base44 preview proxies host port 3000 through a public hostname. Next's
 * dev server validates both the `Origin` header (dev assets / HMR) and the
 * `Origin` of Server Action requests, so the preview origins must be allowed
 * explicitly. Every override below is gated on BASE44_PREVIEW_MODE === "1" and
 * is a no-op (original behaviour) in any other environment.
 */
const isPreview = process.env.BASE44_PREVIEW_MODE === "1";
const publicSuffix = process.env.BASE44_PUBLIC_HOST_SUFFIX;
const sandboxDomain = process.env.BASE44_SANDBOX_HOST_DOMAIN;

const previewOrigins: string[] = isPreview
  ? [
      publicSuffix ? `3000-${publicSuffix}` : "",
      sandboxDomain ? `*.${sandboxDomain}` : "",
    ].filter(Boolean)
  : [];

const frameAncestors = isPreview
  ? `'self' https://3000-${publicSuffix} https://*.${sandboxDomain}`
  : "'self'";

const csp = [
  "default-src 'self'",
  // Next injects inline bootstrap/hydration scripts; a nonce-based policy is the
  // documented follow-up for production hardening.
  `script-src 'self' 'unsafe-inline'${isPreview ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  "connect-src 'self'" + (isPreview ? " ws: wss:" : ""),
  "form-action 'self'",
  `frame-ancestors ${frameAncestors}`,
  "base-uri 'self'",
  "object-src 'none'",
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  ...(isPreview ? [] : [{ key: "X-Frame-Options", value: "SAMEORIGIN" }]),
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-DNS-Prefetch-Control", value: "off" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000; includeSubDomains",
  },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: { formats: ["image/avif", "image/webp"] },
  ...(previewOrigins.length > 0 ? { allowedDevOrigins: previewOrigins } : {}),
  experimental: {
    serverActions: {
      ...(previewOrigins.length > 0 ? { allowedOrigins: previewOrigins } : {}),
      bodySizeLimit: "4mb",
    },
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
