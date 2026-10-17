import type { Metadata } from "next";
import { CompanionPage } from "@/components/companion/CompanionPage";
import {
  companionPageMeta,
  companionStructuredData,
} from "@/lib/companion/content";

export const metadata: Metadata = {
  title: companionPageMeta.title,
  description: companionPageMeta.description,
  keywords: [...companionPageMeta.keywords],
  alternates: { canonical: "/companion" },
  robots: { index: true, follow: true },
  openGraph: {
    title: companionPageMeta.title,
    description: companionPageMeta.description,
    url: "/companion",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: companionPageMeta.title,
    description: companionPageMeta.description,
  },
};

export default function CompanionRoutePage() {
  const structuredData = companionStructuredData();
  return (
    <>
      {structuredData.map((node) => (
        <script
          key={node["@type"]}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
      <CompanionPage />
    </>
  );
}
