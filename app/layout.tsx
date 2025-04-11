import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "PageMinty - Markdown to Beautiful PDF Converter",
  description:
    "Transform your Markdown files into professionally styled PDFs with a click. Real-time preview, customizable styling, and instant downloads.",
  keywords: [
    "markdown",
    "pdf",
    "converter",
    "document",
    "editor",
    "online tool",
    "web app",
  ],
  authors: [{ name: "PageMinty Team" }],
  category: "Productivity Tool",
  metadataBase: new URL("https://pageminty.com"),
  openGraph: {
    title: "PageMinty - Markdown to PDF Converter",
    description:
      "Transform Markdown to beautiful PDFs instantly with real-time preview",
    url: "https://pageminty.com",
    siteName: "PageMinty",
    locale: "en_US",
    type: "website",
    images: [
      {
        url: "https://pageminty.com/og-image.png",
        width: 1200,
        height: 630,
        alt: "PageMinty Screenshot",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "PageMinty - Markdown to PDF Converter",
    description:
      "Transform Markdown to beautiful PDFs instantly with real-time preview",
    images: ["https://pageminty.com/twitter-image.png"],
    creator: "@pageminty",
  },
  applicationName: "PageMinty",
  appleWebApp: {
    capable: true,
    title: "PageMinty",
    statusBarStyle: "black-translucent",
  },
  manifest: "/manifest.json",
  viewport:
    "width=device-width, initial-scale=1, maximum-scale=1, viewport-fit=cover",
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/icons/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/icons/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/icons/favicon-16x16.png"
        />
        <link rel="manifest" href="/manifest.json" />
        <link
          rel="mask-icon"
          href="/icons/safari-pinned-tab.svg"
          color="#7B61FF"
        />
        <meta name="msapplication-TileColor" content="#7B61FF" />
        <meta name="theme-color" content="#0B0121" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
      </head>
      <body
        className={`${montserrat.variable} ${inter.variable} antialiased`}
        style={
          {
            "--background": "#0B0121",
            "--foreground": "#ECECEC",
            "--primary": "#7B61FF",
            "--primary-dark": "#591DDD",
            "--secondary": "#C837C5",
            "--muted": "#939393",
            "--border": "rgba(255, 255, 255, 0.1)",
            "--card-bg": "rgba(255, 255, 255, 0.05)",
          } as React.CSSProperties
        }
      >
        {children}
      </body>
    </html>
  );
}
