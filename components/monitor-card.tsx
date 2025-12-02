"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Activity, Clock, TrendingUp, MoreVertical, Trash2, Power, ExternalLink } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { calculateUptime } from "@/lib/utils";
import StatusBadge from "./status-badge";
import UptimeChart from "./uptime-chart";
import { useToast } from "./ui/use-toast";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface MonitorCardProps {
  monitor: any;
  logs: any[];
}

export default function MonitorCard({ monitor, logs }: MonitorCardProps) {
  const { toast } = useToast();
  const router = useRouter();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  
  const uptime = calculateUptime(logs);
  const lastLog = logs[0];
  const avgResponseTime =
    logs.length > 0
      ? Math.round(
          logs.reduce((sum, log) => sum + (log.responseTime || 0), 0) / logs.length
        )
      : 0;

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
      setShowDeleteDialog(false);
    }
  };

  const toggleActive = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
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
    <>
      <Card className="hover:border-primary transition-colors relative group">
        <Link href={`/monitors/${monitor.id}`}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg truncate">{monitor.name}</CardTitle>
              <div className="flex items-center gap-2">
                <StatusBadge status={monitor.status} />
                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={(e) => {
                      e.preventDefault();
                      router.push(`/monitors/${monitor.id}`);
                    }}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Lihat Detail
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={toggleActive} disabled={isToggling}>
                      <Power className="h-4 w-4 mr-2" />
                      {monitor.active ? "Nonaktifkan" : "Aktifkan"}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem 
                      className="text-destructive focus:text-destructive"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowDeleteDialog(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Hapus Monitor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            <p className="text-sm text-muted-foreground truncate">
              {monitor.type.toUpperCase()} • {monitor.url || monitor.heartbeatToken}
              {!monitor.active && <span className="ml-2 text-xs text-orange-500">(Nonaktif)</span>}
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
        </Link>
      </Card>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
    </>
  );
}
