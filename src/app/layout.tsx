import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import AnalyticsScript from "@/components/AnalyticsScript";
import JsonLd from "@/components/JsonLd";
import { company } from "@/config/company";
import { buildProfessionalServiceLd } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import "./globals.css";

const display = Fraunces({
  subsets: ["latin", "latin-ext"],
  variable: "--font-display",
  display: "swap",
  weight: ["500", "600", "700"],
});

const sans = Manrope({
  subsets: ["latin", "latin-ext"],
  variable: "--font-sans",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

const SITE = company.siteUrl;

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  ...buildMetadata({
    path: "/404/",
    title: "Stránka sa nenašla",
    description:
      "Táto adresa na webe nie je. Vráťte sa na úvodnú stránku alebo pokračujte na self-audit.",
  }),
  authors: [{ name: company.founderName }],
  creator: company.legalName,
  publisher: company.legalName,
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/favicon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/aveng-icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#070b12",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="sk" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans antialiased">
        <AnalyticsScript />
        <JsonLd data={buildProfessionalServiceLd()} />
        {children}
      </body>
    </html>
  );
}
