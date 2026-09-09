import { NextRequest, NextResponse } from "next/server";
import { getClientIP } from "@/lib/ip-utils";

export const dynamic = "force-dynamic";

const INTERESTING = [
  "host",
  "user-agent",
  "accept",
  "accept-language",
  "accept-encoding",
  "connection",
  "cache-control",
  "upgrade-insecure-requests",
  "sec-ch-ua",
  "sec-ch-ua-mobile",
  "sec-ch-ua-platform",
  "sec-fetch-dest",
  "sec-fetch-mode",
  "sec-fetch-site",
  "sec-fetch-user",
  "dnt",
  "cf-ipcountry",
  "cf-ray",
  "x-forwarded-for",
  "x-forwarded-proto",
];

/** GET /api/v1/headers — echoes selected request headers back to the client. */
export async function GET(request: NextRequest) {
  const headers: Record<string, string> = {};
  for (const key of INTERESTING) {
    const value = request.headers.get(key);
    if (value) headers[key] = value;
  }
  return NextResponse.json({
    ip: getClientIP(request.headers),
    headers,
  });
}
