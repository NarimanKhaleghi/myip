import { NextRequest, NextResponse } from "next/server";
import { lookupPTR, checkDNSBL } from "@/lib/dns";
import { getClientIP, isIP } from "@/lib/ip-utils";

export const dynamic = "force-dynamic";

/**
 * GET /api/v1/dnsbl/{address} — PTR record + DNSBL blacklist status.
 * Falls back to the caller's own IP when no address is provided.
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const param = decodeURIComponent(address).trim();
  const fallback = getClientIP(request.headers) ?? "127.0.0.1";
  const target = isIP(param) ? param : fallback;

  const [ptr, dnsbl] = await Promise.all([lookupPTR(target), checkDNSBL(target)]);

  return NextResponse.json({
    ip: target,
    ptr,
    dnsbl,
    dnsblListedCount: dnsbl.filter((d) => d.listed).length,
  });
}
