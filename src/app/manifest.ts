import type { MetadataRoute } from "next";
import { withBasePath, IS_STATIC_BUILD } from "@/lib/static-mode";

// Web app manifest, generated as a route so it can respect the deploy base
// path (GitHub Pages serves the static build under /myip).
// Required for the static export (output: "export").
export const dynamic = "force-static";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "myip.thepm.ir — استعلام جامع اطلاعات IP",
    short_name: "myip",
    description:
      "استعلام رایگان و متن‌باز اطلاعات IP: موقعیت جغرافیایی، ISP، ASN، تشخیص پروکسی/VPN، بررسی DNSBL و ابزارهای تخصصی — دوزبانه و بدون ثبت اطلاعات.",
    lang: "fa",
    dir: "rtl",
    start_url: withBasePath("/"),
    scope: withBasePath("/"),
    display: "standalone",
    background_color: "#0a0a0a",
    theme_color: "#0a0a0a",
    icons: IS_STATIC_BUILD
      ? [
          {
            src: withBasePath("/icon-192.png"),
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
          },
          {
            src: withBasePath("/icon-512.png"),
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
          },
          {
            src: withBasePath("/favicon.svg"),
            sizes: "any",
            type: "image/svg+xml",
          },
        ]
      : [
          { src: "/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
          { src: "/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
          { src: "/favicon.svg", sizes: "any", type: "image/svg+xml" },
        ],
  };
}
