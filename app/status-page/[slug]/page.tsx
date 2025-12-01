import { db } from "@/lib/db";
import { statusPages, statusPageMonitors, monitors, monitorLogs } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { notFound } from "next/navigation";
import StatusPageClient from "./status-page-client";

export default async function StatusPagePublic({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const statusPage = await db.query.statusPages.findFirst({
    where: eq(statusPages.slug, slug),
  });

  if (!statusPage || !statusPage.published) {
    notFound();
  }

  // Ambil monitors untuk status page ini
  const pageMonitors = await db
    .select({
      monitor: monitors,
      order: statusPageMonitors.order,
    })
    .from(statusPageMonitors)
    .innerJoin(monitors, eq(statusPageMonitors.monitorId, monitors.id))
    .where(eq(statusPageMonitors.statusPageId, statusPage.id))
    .orderBy(statusPageMonitors.order);

  // Ambil logs untuk setiap monitor
  const monitorLogsData = await Promise.all(
    pageMonitors.map(async ({ monitor }) => {
      const logs = await db.query.monitorLogs.findMany({
        where: eq(monitorLogs.monitorId, monitor.id),
        orderBy: [desc(monitorLogs.checkedAt)],
        limit: 100,
      });
      return { monitorId: monitor.id, logs };
    })
  );

  return (
    <StatusPageClient
      statusPage={statusPage}
      monitors={pageMonitors.map((m) => m.monitor)}
      monitorLogs={monitorLogsData}
    />
  );
}
