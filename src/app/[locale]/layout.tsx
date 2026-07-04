import type { Metadata } from "next";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { notFound } from "next/navigation";
import { Fraunces, Inter, JetBrains_Mono } from "next/font/google";
import { routing } from "@/i18n/routing";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ChatWidget } from "@/components/chat-widget";
import "../globals.css";

const fraunces = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  weight: ["400", "500", "600"],
});

const inter = Inter({
  subsets: ["latin", "latin-ext", "cyrillic"],
  variable: "--font-body",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "home" });

  return {
    title: `Tartoon — ${t("title1")} ${t("title2")}`,
    description: t("subtitle"),
  };
}

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Включает статический рендеринг страниц под текущую локаль
  setRequestLocale(locale);

  return (
    <html lang={locale}>
      <body
        className={`${fraunces.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
      >
        <NextIntlClientProvider>
          <SiteHeader />
          <main>{children}</main>
          <SiteFooter />
          <ChatWidget />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
