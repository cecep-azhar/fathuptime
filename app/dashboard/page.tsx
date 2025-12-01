import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { monitors, monitorLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import DashboardClient from "./dashboard-client";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  // Ambil semua monitor milik user
  const userMonitors = await db.query.monitors.findMany({
    where: eq(monitors.userId, (session.user as any).id),
    orderBy: [desc(monitors.createdAt)],
  });

  // Ambil logs terbaru untuk setiap monitor (untuk chart)
  const monitorLogsData = await Promise.all(
    userMonitors.map(async (monitor) => {
      const logs = await db.query.monitorLogs.findMany({
        where: eq(monitorLogs.monitorId, monitor.id),
        orderBy: [desc(monitorLogs.checkedAt)],
        limit: 50,
      });
      return { monitorId: monitor.id, logs };
    })
  );

  return (
    <DashboardClient
      monitors={userMonitors}
      monitorLogs={monitorLogsData}
      user={session.user}
    />
  );
}
