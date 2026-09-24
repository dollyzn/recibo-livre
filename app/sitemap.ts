import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  const base = siteConfig.url.replace(/\/$/, "");

  return [
    {
      url: `${base}/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${base}/gerar/`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.9,
    },
  ];
}
