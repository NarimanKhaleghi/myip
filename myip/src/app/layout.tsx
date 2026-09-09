import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Lalezar, Vazirmatn } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { I18nProvider } from "@/components/myip/i18n-provider";
import { ThemeProvider } from "next-themes";

const vazirmatn = Vazirmatn({
  variable: "--font-vazirmatn",
  subsets: ["arabic", "latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrains = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
  display: "swap",
});

const lalezar = Lalezar({
  variable: "--font-lalezar",
  subsets: ["arabic", "latin"],
  weight: "400",
  display: "swap",
});

const GITHUB_URL = "https://github.com/NarimanKhaleghi/myip";
const SITE_URL = "https://myip.thepm.ir";

export const metadata: Metadata = {
  title: {
    default: "myip.thepm.ir | آی پی من چیست؟ — استعلام جامع اطلاعات IP",
    template: "%s | myip.thepm.ir",
  },
  description:
    "آدرس IP خود را فوراً ببینید و هر IP دلخواه را استعلام کنید: موقعیت جغرافیایی روی نقشه، ISP، ASN، تشخیص پروکسی/VPN، بررسی Blacklist و ابزارهای تخصصی — رایگان، سریع و بدون ثبت اطلاعات. See your IP address instantly with geolocation, ISP, ASN, proxy detection and free IP tools.",
  keywords: [
    "آی پی من",
    "ip من چیست",
    "استعلام ip",
    "موقعیت ip",
    "چک کردن ip",
    "آی پی من چند است",
    "what is my ip",
    "my ip address",
    "ip lookup",
    "ip geolocation",
    "check my ip",
    "ipv4",
    "ipv6",
    "ip tracker",
    "reverse dns",
    "dnsbl",
    "proxy detection",
  ],
  authors: [{ name: "Nariman Khaleghi", url: GITHUB_URL }],
  creator: "Nariman Khaleghi",
  metadataBase: new URL(SITE_URL),
  alternates: {
    canonical: "/",
    languages: { fa: "/", en: "/?lang=en" },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "myip.thepm.ir",
    title: "myip.thepm.ir | استعلام جامع اطلاعات IP",
    description:
      "آدرس IP شما با موقعیت جغرافیایی، ISP، تشخیص VPN و ابزارهای حرفه‌ای — کاملاً رایگان. Your IP address with geolocation, ISP, VPN detection and pro tools — completely free.",
    locale: "fa_IR",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "myip.thepm.ir — IP intelligence in pure black & white",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "myip.thepm.ir — استعلام جامع اطلاعات IP",
    description: "Your IP address with geolocation, ISP, VPN detection and pro tools — free.",
    images: ["/og-image.png"],
  },
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  applicationName: "myip.thepm.ir",
  category: "technology",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
    { media: "(prefers-color-scheme: light)", color: "#f5f5f5" },
  ],
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebApplication",
      "@id": `${SITE_URL}/#webapp`,
      name: "myip.thepm.ir",
      url: SITE_URL,
      applicationCategory: "UtilitiesApplication",
      operatingSystem: "Any",
      author: { "@type": "Person", name: "Nariman Khaleghi", url: GITHUB_URL },
      license: "https://opensource.org/licenses/MIT",
      isAccessibleForFree: true,
      description:
        "Free and open-source IP intelligence platform: geolocation, ISP, ASN, proxy/VPN detection, DNSBL checks and IP tools.",
      inLanguage: ["fa", "en"],
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      featureList: [
        "What is my IP",
        "IP geolocation",
        "ASN and ISP lookup",
        "Proxy VPN TOR detection",
        "DNSBL blacklist check",
        "Reverse DNS PTR record",
        "IPv4 and IPv6 support",
        "WebRTC leak test",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "myip.thepm.ir",
      inLanguage: ["fa", "en"],
      potentialAction: {
        "@type": "SearchAction",
        target: {
          "@type": "EntryPoint",
          urlTemplate: `${SITE_URL}/?ip={search_term_string}`,
        },
        "query-input": "required name=search_term_string",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body
        className={`${vazirmatn.variable} ${inter.variable} ${jetbrains.variable} ${lalezar.variable} antialiased bg-background text-foreground font-fa`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <I18nProvider>{children}</I18nProvider>
        </ThemeProvider>
        <Toaster />
      </body>
    </html>
  );
}
