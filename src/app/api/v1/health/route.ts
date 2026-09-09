import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/** GET /api/v1/health — service status (also used for latency measurement). */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "myip.thepm.ir",
    time: new Date().toISOString(),
  });
}
