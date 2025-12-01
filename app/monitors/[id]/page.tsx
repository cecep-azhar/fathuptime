import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { monitors, monitorLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import MonitorDetailClient from "./monitor-detail-client";

export default async function MonitorDetailPage({ params }: { params: { id: string } }) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const monitor = await db.query.monitors.findFirst({
    where: eq(monitors.id, params.id),
  });

  if (!monitor || monitor.userId !== session.user.id) {
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
