"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowLeft, 
  Activity, 
  Clock, 
  TrendingUp, 
  Link as LinkIcon, 
  Copy, 
  Trash2, 
  Settings,
  Power
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import StatusBadge from "@/components/status-badge";
import UptimeChart from "@/components/uptime-chart";
import { calculateUptime } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface MonitorDetailClientProps {
  monitor: any;
  logs: any[];
}

export default function MonitorDetailClient({ monitor, logs }: MonitorDetailClientProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
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

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/monitors/${monitor.id}`, {
        method: "DELETE",
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Delete error:", data);
        throw new Error(data.error || "Gagal menghapus monitor");
      }

      toast({
        title: "Monitor Dihapus",
        description: `Monitor "${monitor.name}" berhasil dihapus`,
      });

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error("Delete monitor error:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal menghapus monitor",
        variant: "destructive",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleActive = async () => {
    setIsToggling(true);
    try {
      const response = await fetch(`/api/monitors/${monitor.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          active: !monitor.active,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Toggle error:", data);
        throw new Error(data.error || "Gagal mengubah status monitor");
      }

      toast({
        title: monitor.active ? "Monitor Dinonaktifkan" : "Monitor Diaktifkan",
        description: `Monitor "${monitor.name}" ${monitor.active ? "dinonaktifkan" : "diaktifkan"}`,
      });

      router.refresh();
    } catch (error: any) {
      console.error("Toggle monitor error:", error);
      toast({
        title: "Error",
        description: error.message || "Gagal mengubah status monitor",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
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
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{monitor.name}</h1>
              <p className="text-muted-foreground">
                {monitor.type.toUpperCase()} • {monitor.url || monitor.heartbeatToken}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <StatusBadge status={monitor.status} />
              <Button
                variant={monitor.active ? "outline" : "default"}
                size="sm"
                onClick={toggleActive}
                disabled={isToggling}
              >
                <Power className="h-4 w-4 mr-2" />
                {monitor.active ? "Nonaktifkan" : "Aktifkan"}
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm">
                    <Trash2 className="h-4 w-4 mr-2" />
                    Hapus
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Hapus Monitor?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Monitor <strong>{monitor.name}</strong> dan semua data log-nya akan dihapus permanen.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleDelete}
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Menghapus..." : "Ya, Hapus"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
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
