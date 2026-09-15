import type { MetadataRoute } from "next";

// Required for the GitHub Pages static export (output: "export").
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://myip.thepm.ir";
  const now = new Date();
  return [
    {
      url: base,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${base}/#articles`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${base}/#faq`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
    {
      url: `${base}/api/v1/ip`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.5,
    },
  ];
}
