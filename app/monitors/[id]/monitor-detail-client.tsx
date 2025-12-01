"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Activity, Clock, TrendingUp, Link as LinkIcon, Copy } from "lucide-react";
import Link from "next/link";
import StatusBadge from "@/components/status-badge";
import UptimeChart from "@/components/uptime-chart";
import { calculateUptime } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

interface MonitorDetailClientProps {
  monitor: any;
  logs: any[];
}

export default function MonitorDetailClient({ monitor, logs }: MonitorDetailClientProps) {
  const { toast } = useToast();
  const uptime = calculateUptime(logs);
  const lastLog = logs[0];
  const avgResponseTime =
    logs.length > 0
      ? Math.round(logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length)
      : 0;

  const copyHeartbeatUrl = () => {
    if (monitor.heartbeatToken) {
      const url = `${window.location.origin}/api/push/${monitor.heartbeatToken}?status=up&msg=OK&ping=0`;
      navigator.clipboard.writeText(url);
      toast({
        title: "URL Disalin",
        description: "Heartbeat URL telah disalin ke clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali ke Dashboard
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{monitor.name}</h1>
              <p className="text-muted-foreground">
                {monitor.type.toUpperCase()} • {monitor.url || monitor.heartbeatToken}
              </p>
            </div>
            <StatusBadge status={monitor.status} />
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Uptime
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{uptime.toFixed(2)}%</div>
              <p className="text-xs text-muted-foreground mt-1">
                100 check terakhir
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Response Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{avgResponseTime}ms</div>
              <p className="text-xs text-muted-foreground mt-1">Rata-rata</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Interval
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{monitor.interval}s</div>
              <p className="text-xs text-muted-foreground mt-1">Check interval</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Checks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{logs.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Checks recorded</p>
            </CardContent>
          </Card>
        </div>

        {/* Heartbeat Info */}
        {monitor.type === "heartbeat" && monitor.heartbeatToken && (
          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Heartbeat Endpoint</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                Gunakan endpoint ini untuk mengirim heartbeat dari aplikasi Anda:
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 p-3 bg-muted rounded-md text-sm">
                  GET /api/push/{monitor.heartbeatToken}?status=up&msg=OK&ping=123
                </code>
                <Button variant="outline" size="icon" onClick={copyHeartbeatUrl}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-xs text-muted-foreground mt-4">
                <strong>Parameters:</strong> status (up/down), msg (message), ping (response time in ms)
              </p>
            </CardContent>
          </Card>
        )}

        {/* Response Time Chart */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Response Time History</CardTitle>
          </CardHeader>
          <CardContent>
            <UptimeChart logs={logs} />
          </CardContent>
        </Card>

        {/* Recent Checks */}
        <Card>
          <CardHeader>
            <CardTitle>Check History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {logs.slice(0, 20).map((log, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted"
                >
                  <div className="flex items-center gap-3">
                    <StatusBadge status={log.status} />
                    <span className="text-sm">
                      {new Date(log.checkedAt).toLocaleString("id-ID")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    {log.responseTime && <span>{log.responseTime}ms</span>}
                    {log.statusCode && <span>HTTP {log.statusCode}</span>}
                    {log.message && <span className="max-w-xs truncate">{log.message}</span>}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
