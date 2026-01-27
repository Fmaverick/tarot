import type { Metadata } from "next";
import localFont from "next/font/local";
import { Cinzel } from "next/font/google";
import Script from "next/script";
import { LanguageInit } from "@/components/LanguageInit";
import "./globals.css";

const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-serif",
});

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "Lumin Tarot",
  description: "Mystic insights through the veil of digital consciousness",
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
  // ← 这里用你的真实GA ID
  const GA_MEASUREMENT_ID = "G-H1L7M382H8";

  return (
    <html lang="en">
      <head>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}');
          `}
        </Script>
        <meta name="google-site-verification" content="YOUR_GSC_CODE_HERE" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${cinzel.variable} antialiased font-sans`}
      >
        <LanguageInit />
        {children}
      </body>
    </html>
  );
}
