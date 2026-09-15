import type { MetadataRoute } from "next";

// Required for the GitHub Pages static export (output: "export").
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/api/"],
      },
    ],
    sitemap: "https://myip.thepm.ir/sitemap.xml",
  };
}
