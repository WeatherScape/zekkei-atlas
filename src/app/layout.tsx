import type { Metadata, Viewport } from "next";
import { SiteHeader } from "@/components/site-header";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://zekkei-atlas.vercel.app"),
  title: "ZEKKEI ATLAS | 絶景トラベルAIマップ",
  description: "季節、時間、気分で出会う、一生に一度の絶景。",
  applicationName: "ZEKKEI ATLAS",
  keywords: [
    "ZEKKEI ATLAS",
    "絶景",
    "旅行",
    "AI旅行プランナー",
    "トラベルマップ",
    "ポートフォリオ"
  ],
  authors: [{ name: "ZEKKEI ATLAS" }],
  creator: "ZEKKEI ATLAS",
  openGraph: {
    title: "ZEKKEI ATLAS",
    description: "季節、時間、気分で出会う、一生に一度の絶景。",
    url: "/",
    siteName: "ZEKKEI ATLAS",
    images: [
      {
        url: "/og.svg",
        width: 1200,
        height: 630,
        alt: "ZEKKEI ATLAS"
      }
    ],
    locale: "ja_JP",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "ZEKKEI ATLAS",
    description: "季節、時間、気分で出会う、一生に一度の絶景。",
    images: ["/og.svg"]
  },
  icons: {
    icon: "/favicon.svg"
  },
  manifest: "/manifest.webmanifest"
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: "#020617"
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
