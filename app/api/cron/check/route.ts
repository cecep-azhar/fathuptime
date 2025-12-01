import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { monitors, monitorLogs, notifications, notificationChannels } from "@/lib/db/schema";
import { eq, and, lt } from "drizzle-orm";
import { checkHttp, checkKeyword, checkPing, checkTcpPort } from "@/lib/monitor-checker";

// Vercel Cron Job endpoint
// Dipanggil tiap menit oleh Vercel Cron
export async function GET(request: NextRequest) {
  try {
    // Verifikasi cron secret untuk keamanan
    const authHeader = request.headers.get("authorization");
    if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("[CRON] Starting monitor checks...");

    // Ambil semua monitor yang active
    const activeMonitors = await db.query.monitors.findMany({
      where: eq(monitors.active, true),
    });

    console.log(`[CRON] Found ${activeMonitors.length} active monitors`);

    // Check monitors yang sudah waktunya dicek
    const now = Date.now();
    const monitorsToCheck = activeMonitors.filter((monitor) => {
      if (!monitor.lastCheck) return true; // Belum pernah dicek
      const timeSinceLastCheck = (now - monitor.lastCheck.getTime()) / 1000;
      return timeSinceLastCheck >= monitor.interval;
    });

    console.log(`[CRON] Checking ${monitorsToCheck.length} monitors`);

    // Check paralel (max 10 concurrent)
    const batchSize = 10;
    for (let i = 0; i < monitorsToCheck.length; i += batchSize) {
      const batch = monitorsToCheck.slice(i, i + batchSize);
      await Promise.all(batch.map((monitor) => checkMonitor(monitor)));
    }

    console.log("[CRON] All checks completed");

    return NextResponse.json({
      success: true,
      checked: monitorsToCheck.length,
      total: activeMonitors.length,
    });
  } catch (error) {
    console.error("[CRON] Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

async function checkMonitor(monitor: any) {
  try {
    console.log(`[CHECK] ${monitor.name} (${monitor.type})`);

    let result;

    // Jalankan check sesuai tipe
    switch (monitor.type) {
      case "http":
      case "https":
        result = await checkHttp(monitor.url, monitor.timeout * 1000);
        break;
      case "keyword":
        result = await checkKeyword(monitor.url, monitor.keyword, monitor.timeout * 1000);
        break;
      case "ping":
        result = await checkPing(monitor.url, monitor.timeout);
        break;
      case "tcp":
        result = await checkTcpPort(monitor.url, monitor.port, monitor.timeout * 1000);
        break;
      case "heartbeat":
        // Heartbeat dicek dari push endpoint, skip di sini
        return;
      default:
        console.log(`[CHECK] Unknown type: ${monitor.type}`);
        return;
    }

    // Simpan log
    await db.insert(monitorLogs).values({
      monitorId: monitor.id,
      status: result.status,
      responseTime: Math.round(result.responseTime),
      statusCode: result.statusCode,
      message: result.message,
    });

    // Update monitor status
    const previousStatus = monitor.status;
    const updateData: any = {
      status: result.status,
      lastCheck: new Date(),
      updatedAt: new Date(),
    };

    if (result.status === "up") {
      updateData.lastUptime = new Date();
    } else {
      updateData.lastDowntime = new Date();
    }

    await db
      .update(monitors)
      .set(updateData)
      .where(eq(monitors.id, monitor.id));

    // Kirim notifikasi jika status berubah
    if (previousStatus !== result.status && previousStatus !== "pending") {
      await sendNotifications(monitor, result.status, result.message);
    }

    console.log(`[CHECK] ${monitor.name} - ${result.status} (${result.responseTime}ms)`);
  } catch (error) {
    console.error(`[CHECK] Error checking ${monitor.name}:`, error);
  }
}

async function sendNotifications(monitor: any, status: string, message: string) {
  try {
    // Ambil notification channels untuk monitor ini
    const channels = await db.query.notificationChannels.findMany({
      where: and(
        eq(notificationChannels.userId, monitor.userId),
        eq(notificationChannels.active, true)
      ),
    });

    if (channels.length === 0) return;

    // Buat notifikasi untuk setiap channel
    for (const channel of channels) {
      const notifMessage = `[${status.toUpperCase()}] ${monitor.name}\n${message}`;

      await db.insert(notifications).values({
        monitorId: monitor.id,
        channelId: channel.id,
        type: status,
        message: notifMessage,
        sent: false,
      });

      // Kirim notifikasi sesuai tipe channel
      await sendNotification(channel, notifMessage, monitor);
    }
  } catch (error) {
    console.error("[NOTIFICATION] Error:", error);
  }
}

async function sendNotification(channel: any, message: string, monitor: any) {
  try {
    switch (channel.type) {
      case "email":
        // Implementasi email via Resend
        // TODO: Import Resend dan kirim email
        break;
      case "telegram":
        if (channel.telegramBotToken && channel.telegramChatId) {
          await fetch(
            `https://api.telegram.org/bot${channel.telegramBotToken}/sendMessage`,
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                chat_id: channel.telegramChatId,
                text: message,
              }),
            }
          );
        }
        break;
      case "discord":
        if (channel.discordWebhookUrl) {
          await fetch(channel.discordWebhookUrl, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              content: message,
            }),
          });
        }
        break;
      case "ntfy":
        if (channel.ntfyTopic) {
          await fetch(`${channel.ntfyServer}/${channel.ntfyTopic}`, {
            method: "POST",
            body: message,
          });
        }
        break;
    }

    // Update status sent
    await db
      .update(notifications)
      .set({ sent: true, sentAt: new Date() })
      .where(
        and(
          eq(notifications.monitorId, monitor.id),
          eq(notifications.channelId, channel.id),
          eq(notifications.sent, false)
        )
      );
  } catch (error) {
    console.error(`[NOTIFICATION] Error sending to ${channel.type}:`, error);
  }
}
