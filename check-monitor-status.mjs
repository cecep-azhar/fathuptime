// Script untuk melihat status monitor terbaru
import { db } from "./lib/db/index.js";
import { monitors, monitorLogs } from "./lib/db/schema.js";
import { desc } from "drizzle-orm";

async function checkStatus() {
  console.log("\n=== Status Monitor ===\n");
  
  // Ambil semua monitor
  const allMonitors = await db.query.monitors.findMany({
    orderBy: (monitors, { asc }) => [asc(monitors.name)],
  });
  
  for (const monitor of allMonitors) {
    console.log(`📊 ${monitor.name}`);
    console.log(`   Type: ${monitor.type}`);
    console.log(`   URL: ${monitor.url}`);
    console.log(`   Status: ${monitor.status}`);
    console.log(`   Last Check: ${monitor.lastCheck ? new Date(monitor.lastCheck).toLocaleString('id-ID') : 'Belum pernah'}`);
    console.log(`   Interval: ${monitor.interval}s`);
    console.log(`   Active: ${monitor.active ? 'Ya' : 'Tidak'}`);
    console.log();
  }
  
  console.log("\n=== Log Terbaru (5 terakhir) ===\n");
  
  // Ambil log terbaru
  const recentLogs = await db.query.monitorLogs.findMany({
    orderBy: (monitorLogs, { desc }) => [desc(monitorLogs.checkedAt)],
    limit: 5,
    with: {
      monitor: true,
    },
  });
  
  for (const log of recentLogs) {
    const time = new Date(log.checkedAt).toLocaleString('id-ID');
    console.log(`[${time}] ${log.monitorId}`);
    console.log(`   Status: ${log.status}`);
    console.log(`   Response Time: ${log.responseTime}ms`);
    console.log(`   Message: ${log.message}`);
    console.log();
  }
}

checkStatus().catch(console.error);
