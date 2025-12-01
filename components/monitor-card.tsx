"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Activity, Clock, TrendingUp } from "lucide-react";
import Link from "next/link";
import { calculateUptime } from "@/lib/utils";
import StatusBadge from "./status-badge";
import UptimeChart from "./uptime-chart";

interface MonitorCardProps {
  monitor: any;
  logs: any[];
}

export default function MonitorCard({ monitor, logs }: MonitorCardProps) {
  const uptime = calculateUptime(logs);
  const lastLog = logs[0];
  const avgResponseTime =
    logs.length > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length
        )
      : 0;

  return (
    <Link href={`/monitors/${monitor.id}`}>
      <Card className="hover:border-primary transition-colors cursor-pointer">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg truncate">{monitor.name}</CardTitle>
            <StatusBadge status={monitor.status} />
          </div>
          <p className="text-sm text-muted-foreground truncate">
            {monitor.type.toUpperCase()} • {monitor.url || monitor.heartbeatToken}
          </p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div>
                <div className="text-2xl font-bold">{uptime.toFixed(1)}%</div>
                <div className="text-xs text-muted-foreground">Uptime</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{avgResponseTime}ms</div>
                <div className="text-xs text-muted-foreground">Avg Time</div>
              </div>
              <div>
                <div className="text-2xl font-bold">{monitor.interval}s</div>
                <div className="text-xs text-muted-foreground">Interval</div>
              </div>
            </div>

            {/* Mini Chart */}
            <UptimeChart logs={logs} mini />

            {/* Last Check */}
            {lastLog && (
              <div className="text-xs text-muted-foreground flex items-center justify-between">
                <span className="flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Terakhir cek:{" "}
                  {new Date(lastLog.checkedAt).toLocaleString("id-ID")}
                </span>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
