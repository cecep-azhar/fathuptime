import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { monitors } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { generateRandomString } from "@/lib/utils";

// GET - Ambil semua monitor user
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userMonitors = await db.query.monitors.findMany({
      where: eq(monitors.userId, session.user.id),
    });

    return NextResponse.json(userMonitors);
  } catch (error) {
    console.error("GET monitors error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// POST - Buat monitor baru
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, type, url, keyword, port, interval, timeout } = body;

    // Validasi
    if (!name || !type) {
      return NextResponse.json(
        { error: "Nama dan tipe harus diisi" },
        { status: 400 }
      );
    }

    // Generate heartbeat token untuk tipe heartbeat
    const heartbeatToken = type === "heartbeat" ? generateRandomString(32) : null;

    const newMonitor = await db.insert(monitors).values({
      userId: session.user.id,
      name,
      type,
      url: url || null,
      keyword: keyword || null,
      port: port ? parseInt(port) : null,
      interval: parseInt(interval) || 60,
      timeout: parseInt(timeout) || 30,
      heartbeatToken,
      status: "pending",
    }).returning();

    return NextResponse.json(newMonitor[0], { status: 201 });
  } catch (error) {
    console.error("POST monitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
