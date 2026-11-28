import type { Metadata, Viewport } from "next";
import "./globals.css";
import { getSettings } from "@/lib/settings";
import { organizationJsonLd, websiteJsonLd, jsonLdScript, SITE_URL } from "@/lib/seo";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  return {
    metadataBase: new URL(SITE_URL),
    title: {
      default: `${settings.brandName} | ${settings.tagline}`,
      template: `%s | ${settings.brandName}`,
    },
    description: settings.metaDescription,
    applicationName: settings.brandName,
    keywords: ["طلا", "جواهرات", "گردنبند طلا", "انگشتر طلا", "گوشواره طلا", "طلای ۱۸ عیار", "زرّین"],
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "fa_IR",
      siteName: settings.brandName,
      title: `${settings.brandName} | ${settings.tagline}`,
      description: settings.metaDescription,
      images: [{ url: "/hero.svg", width: 900, height: 900, alt: `${settings.brandName} — ${settings.tagline}` }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${settings.brandName} | ${settings.tagline}`,
      description: settings.metaDescription,
      images: ["/hero.svg"],
    },
    robots: { index: true, follow: true },
    icons: { icon: "/favicon.svg" },
    formatDetection: { telephone: false },
  };
}

export const viewport: Viewport = {
  themeColor: "#fbf8f4",
  width: "device-width",
  initialScale: 1,
  colorScheme: "light",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <html lang="fa" dir="rtl">
      <head>
        <link rel="preload" href="/fonts/Vazirmatn-Regular.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/Vazirmatn-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <link rel="preload" href="/fonts/CormorantGaramond-SemiBold.woff2" as="font" type="font/woff2" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(organizationJsonLd(settings))} />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLdScript(websiteJsonLd(settings))} />
      </head>
      <body className="min-h-dvh antialiased">{children}</body>
    </html>
  );
}
