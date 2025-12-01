import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { monitors, monitorLogs } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Heartbeat push endpoint
// GET /api/push/[token]?status=up&msg=OK&ping=123
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get("status") || "up";
    const message = searchParams.get("msg") || searchParams.get("message") || "OK";
    const ping = searchParams.get("ping");

    // Cari monitor dengan token ini
    const monitor = await db.query.monitors.findFirst({
      where: eq(monitors.heartbeatToken, token),
    });

    if (!monitor) {
      return NextResponse.json({ error: "Invalid token" }, { status: 404 });
    }

    // Simpan log heartbeat
    await db.insert(monitorLogs).values({
      monitorId: monitor.id,
      status: status === "up" ? "up" : "down",
      responseTime: ping ? parseInt(ping) : 0,
      message: message,
    });

    // Update monitor
    await db
      .update(monitors)
      .set({
        status: status === "up" ? "up" : "down",
        lastCheck: new Date(),
        lastUptime: status === "up" ? new Date() : monitor.lastUptime,
        updatedAt: new Date(),
      })
      .where(eq(monitors.id, monitor.id));

    return NextResponse.json({
      ok: true,
      message: "Heartbeat received",
    });
  } catch (error) {
    console.error("[HEARTBEAT] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
