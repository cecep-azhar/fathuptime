import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { monitors } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

// GET - Ambil monitor spesifik
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    const monitor = await db.query.monitors.findFirst({
      where: and(
        eq(monitors.id, id),
        eq(monitors.userId, (session.user as any).id)
      ),
    });

    if (!monitor) {
      return NextResponse.json({ error: "Monitor tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json(monitor);
  } catch (error) {
    console.error("GET monitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// PATCH - Update monitor
export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const { name, url, keyword, port, interval, timeout, active } = body;

    // Cek ownership
    const monitor = await db.query.monitors.findFirst({
      where: and(
        eq(monitors.id, id),
        eq(monitors.userId, (session.user as any).id)
      ),
    });

    if (!monitor) {
      return NextResponse.json({ error: "Monitor tidak ditemukan" }, { status: 404 });
    }

    // Update monitor
    const updateData: any = {
      updatedAt: new Date(),
    };

    if (name !== undefined) updateData.name = name;
    if (url !== undefined) updateData.url = url;
    if (keyword !== undefined) updateData.keyword = keyword;
    if (port !== undefined) updateData.port = parseInt(port);
    if (interval !== undefined) updateData.interval = parseInt(interval);
    if (timeout !== undefined) updateData.timeout = parseInt(timeout);
    if (active !== undefined) updateData.active = active;

    const updated = await db
      .update(monitors)
      .set(updateData)
      .where(eq(monitors.id, id))
      .returning();

    return NextResponse.json(updated[0]);
  } catch (error) {
    console.error("PATCH monitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// DELETE - Hapus monitor
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;

    // Cek ownership
    const monitor = await db.query.monitors.findFirst({
      where: and(
        eq(monitors.id, id),
        eq(monitors.userId, (session.user as any).id)
      ),
    });

    if (!monitor) {
      return NextResponse.json({ error: "Monitor tidak ditemukan" }, { status: 404 });
    }

    // Hapus monitor (cascade akan otomatis hapus logs, notifications, dll)
    await db.delete(monitors).where(eq(monitors.id, id));

    return NextResponse.json({ 
      success: true, 
      message: "Monitor berhasil dihapus" 
    });
  } catch (error) {
    console.error("DELETE monitor error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
