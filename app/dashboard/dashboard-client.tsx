"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Moon, Sun, LogOut, User, Settings, Shield } from "lucide-react";
import { useTheme } from "next-themes";
import { signOut } from "next-auth/react";
import MonitorCard from "@/components/monitor-card";
import AddMonitorDialog from "@/components/add-monitor-dialog";
import Link from "next/link";

interface DashboardClientProps {
  monitors: any[];
  monitorLogs: { monitorId: string; logs: any[] }[];
  user: any;
}

export default function DashboardClient({ monitors, monitorLogs, user }: DashboardClientProps) {
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const [showAddMonitor, setShowAddMonitor] = useState(false);

  const getLogsForMonitor = (monitorId: string) => {
    return monitorLogs.find((m) => m.monitorId === monitorId)?.logs || [];
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">FathUptime</h1>
            <p className="text-sm text-muted-foreground">Monitoring Indonesia 🇮🇩</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => signOut({ callbackUrl: "/login" })}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-3xl font-bold">Dashboard</h2>
            <p className="text-muted-foreground">
              Selamat datang, {user.name || user.email}
            </p>
          </div>
          <Button onClick={() => setShowAddMonitor(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Monitor
          </Button>
        </div>

        {/* Monitors Grid */}
        {monitors.length === 0 ? (
          <Card className="p-12 text-center">
            <div className="max-w-md mx-auto">
              <h3 className="text-2xl font-bold mb-2">Belum Ada Monitor</h3>
              <p className="text-muted-foreground mb-6">
                Mulai monitoring website atau server Anda sekarang!
              </p>
              <Button onClick={() => setShowAddMonitor(true)} size="lg">
                <Plus className="h-5 w-5 mr-2" />
                Tambah Monitor Pertama
              </Button>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {monitors.map((monitor) => (
              <MonitorCard
                key={monitor.id}
                monitor={monitor}
                logs={getLogsForMonitor(monitor.id)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t mt-12">
        <div className="container mx-auto px-4 py-6 text-center text-sm text-muted-foreground">
          <p>
            Made with ❤️ in Bandung, Indonesia — Cecep Azhar © 2025
          </p>
          <p className="mt-2">
            <a
              href="https://trakteer.id/cecepazhar"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              ☕ Dukung saya di Trakteer
            </a>
          </p>
        </div>
      </footer>

      <AddMonitorDialog
        open={showAddMonitor}
        onOpenChange={setShowAddMonitor}
        onSuccess={() => {
          setShowAddMonitor(false);
          router.refresh();
        }}
      />
    </div>
  );
}
