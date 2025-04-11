import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Markdown to PDF Converter",
  description: "Convert your Markdown files to beautiful PDFs with ease",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
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
