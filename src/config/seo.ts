import { siteConfig } from "./site";

export const seoConfig = {
  titleTemplate: `%s | ${siteConfig.name}`,

  defaultTitle: `${siteConfig.name} — AI-Native Visual Workspace`,

  description: siteConfig.description,

  keywords: [
    "Drawsy AI",
    "AI-native visual workspace",
    "AI canvas",
    "AI visualisation",
    "AI visualization",
  ],
} as const;
