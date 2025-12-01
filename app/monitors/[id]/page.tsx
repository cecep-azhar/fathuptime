import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { monitors, monitorLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import MonitorDetailClient from "./monitor-detail-client";

export default async function MonitorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const { id } = await params;
  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, id),
  });

  if (!monitor || monitor.userId !== (session.user as any).id) {
    notFound();
  }

  // Ambil logs
  const logs = await db.query.monitorLogs.findMany({
    where: eq(monitorLogs.monitorId, monitor.id),
    orderBy: [desc(monitorLogs.checkedAt)],
    limit: 100,
  });

  return <MonitorDetailClient monitor={monitor} logs={logs} />;
}
