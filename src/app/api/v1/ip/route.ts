import { NextRequest, NextResponse } from "next/server";
import { lookupWithCache } from "@/lib/ip-lookup";
import { getClientIP, isIP } from "@/lib/ip-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/ip — aggregated info for the caller's own IP
 * GET /api/v1/ip?raw=1 — plain text, just the caller's IP
 * GET /api/v1/ip?ip=8.8.8.8 — aggregated info for a given IP
 */
export async function GET(request: NextRequest) {
  const param = request.nextUrl.searchParams.get("ip")?.trim() ?? "";
  const raw = request.nextUrl.searchParams.get("raw");
  const clientIP = getClientIP(request.headers) ?? "127.0.0.1";

  if (raw) {
    return new NextResponse(clientIP, {
      headers: { "Content-Type": "text/plain; charset=utf-8" },
    });
  }

  const target = param !== "" ? param : clientIP;
  if (!isIP(target)) {
    return NextResponse.json(
      { error: "invalid_ip", message: "Not a valid IPv4/IPv6 address." },
      { status: 400 }
    );
  }

  return NextResponse.json(await lookupWithCache(target));
}
