import type { Metadata } from "next";
import { Fustat } from "next/font/google";
import { HashScrollRoot } from "@/components/motion/HashScrollRoot";
import { RevealRoot } from "@/components/motion/RevealRoot";
import { seoConfig } from "@/config/seo";
import { siteConfig } from "@/config/site";
import "./globals.css";

const fustat = Fustat({
  variable: "--font-fustat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: seoConfig.defaultTitle,
    template: seoConfig.titleTemplate,
  },
  description: seoConfig.description,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${fustat.variable} h-full antialiased`}>
      <body className="flex h-full min-h-full flex-col font-sans">
        <RevealRoot />
        <HashScrollRoot />
        {children}
      </body>
    </html>
  );
}
