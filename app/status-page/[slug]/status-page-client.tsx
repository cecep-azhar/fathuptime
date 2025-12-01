"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "@/components/status-badge";
import UptimeChart from "@/components/uptime-chart";
import { calculateUptime } from "@/lib/utils";
import { Activity, Clock, TrendingUp } from "lucide-react";

interface StatusPageClientProps {
  statusPage: any;
  monitors: any[];
  monitorLogs: { monitorId: string; logs: any[] }[];
}

export default function StatusPageClient({
  statusPage,
  monitors,
  monitorLogs,
}: StatusPageClientProps) {
  const getLogsForMonitor = (monitorId: string) => {
    return monitorLogs.find((m) => m.monitorId === monitorId)?.logs || [];
  };

  // Hitung status keseluruhan
  const allUp = monitors.every((m) => m.status === "up");
  const someDown = monitors.some((m) => m.status === "down");

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-8">
          <h1 className="text-4xl font-bold mb-2">{statusPage.title}</h1>
          {statusPage.description && (
            <p className="text-muted-foreground">{statusPage.description}</p>
          )}
          <div className="mt-4">
            {allUp && (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/20">
                <Activity className="h-5 w-5 mr-2" />
                Semua Sistem Operasional
              </div>
            )}
            {someDown && (
              <div className="inline-flex items-center px-4 py-2 rounded-lg bg-red-500/10 text-red-500 border border-red-500/20">
                <Activity className="h-5 w-5 mr-2" />
                Ada Sistem Bermasalah
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Monitors */}
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-6">
          {monitors.map((monitor) => {
            const logs = getLogsForMonitor(monitor.id);
            const uptime = calculateUptime(logs);
            const lastLog = logs[0];
            const avgResponseTime =
              logs.length > 0
                ? Math.round(
                    logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) /
                      logs.length
                  )
                : 0;

            return (
              <Card key={monitor.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle>{monitor.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">
                        {monitor.type.toUpperCase()} • {monitor.url}
                      </p>
                    </div>
                    <StatusBadge status={monitor.status} />
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold">{uptime.toFixed(2)}%</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Uptime (50 cek terakhir)
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold">{avgResponseTime}ms</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Response Time Rata-rata
                      </div>
                    </div>
                    <div className="text-center p-4 rounded-lg bg-muted">
                      <div className="text-3xl font-bold">{monitor.interval}s</div>
                      <div className="text-sm text-muted-foreground mt-1">
                        Interval Check
                      </div>
                    </div>
                  </div>

                  {/* Chart */}
                  <div>
                    <h3 className="text-sm font-medium mb-2">Response Time (ms)</h3>
                    <UptimeChart logs={logs} />
                  </div>

                  {/* Last Check */}
                  {lastLog && (
                    <div className="mt-4 text-sm text-muted-foreground flex items-center">
                      <Clock className="h-4 w-4 mr-2" />
                      Terakhir dicek:{" "}
                      {new Date(lastLog.checkedAt).toLocaleString("id-ID")}
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>Powered by FathUptime</p>
          <p className="mt-2">
            Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025
          </p>
        </div>
      </footer>
    </div>
  );
}
