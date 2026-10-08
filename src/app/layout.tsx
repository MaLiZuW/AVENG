import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { company } from "@/config/company";
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
const TITLE = "AVENG | Procesný audit a technické vedenie pre MSP";
const DESCRIPTION =
  "Procesný self-audit a seniorné technické vedenie pre výrobné MSP na Slovensku a Morave. Inšpirované princípmi Lean, TPM/OEE.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: TITLE,
    template: "%s | AVENG",
  },
  description: DESCRIPTION,
  keywords: [
    "procesný audit",
    "fractional engineering manager",
    "OEE",
    "PLM",
    "PDM",
    "NPI",
    "ECO",
    "výrobné MSP",
    "Slovensko",
    "Morava",
    "AddValueEngineering",
    "AVENG",
  ],
  authors: [{ name: company.founderName }],
  creator: company.legalName,
  publisher: company.legalName,
  alternates: { canonical: SITE },
  openGraph: {
    type: "website",
    locale: "sk_SK",
    url: SITE,
    siteName: company.brandName,
    title: TITLE,
    description: DESCRIPTION,
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "AddValueEngineering — procesný audit pre MSP",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  icons: {
    icon: [
      { url: "/aveng-icon.svg", type: "image/svg+xml" },
      { url: "/aveng-mark.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/aveng-mark.png", sizes: "180x180", type: "image/png" }],
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
        <JsonLd />
        {children}
      </body>
    </html>
  );
}
