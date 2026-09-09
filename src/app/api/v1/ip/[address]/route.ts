import { NextRequest, NextResponse } from "next/server";
import { lookupWithCache } from "@/lib/ip-lookup";
import { isIP } from "@/lib/ip-utils";

export const dynamic = "force-dynamic";

/** GET /api/v1/ip/{address} — aggregated info for a specific IP. */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ address: string }> }
) {
  const { address } = await params;
  const target = decodeURIComponent(address).trim();

  if (!isIP(target)) {
    return NextResponse.json(
      { error: "invalid_ip", message: "Not a valid IPv4/IPv6 address." },
      { status: 400 }
    );
  }

  return NextResponse.json(await lookupWithCache(target));
}
