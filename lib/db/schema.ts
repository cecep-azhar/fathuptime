import { sqliteTable, text, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";

// Users table
export const users = sqliteTable("users", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "timestamp_ms" }),
  image: text("image"),
  password: text("password"), // untuk credentials login
  twoFactorSecret: text("two_factor_secret"),
  twoFactorEnabled: integer("two_factor_enabled", { mode: "boolean" }).default(false),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Accounts table (untuk OAuth)
export const accounts = sqliteTable("accounts", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("provider_account_id").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
});

// Sessions table
export const sessions = sqliteTable("sessions", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  sessionToken: text("session_token").notNull().unique(),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Verification Tokens
export const verificationTokens = sqliteTable("verification_tokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull().unique(),
  expires: integer("expires", { mode: "timestamp_ms" }).notNull(),
});

// Monitor Types: http, https, keyword, ping, tcp, heartbeat
export const monitors = sqliteTable("monitors", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // http, https, keyword, ping, tcp, heartbeat
  url: text("url"),
  keyword: text("keyword"), // untuk keyword monitoring
  port: integer("port"), // untuk TCP port monitoring
  interval: integer("interval").default(60), // detik
  timeout: integer("timeout").default(30), // detik
  retries: integer("retries").default(3),
  active: integer("active", { mode: "boolean" }).default(true),
  
  // Status
  status: text("status").default("pending"), // up, down, pending
  lastCheck: integer("last_check", { mode: "timestamp_ms" }),
  lastUptime: integer("last_uptime", { mode: "timestamp_ms" }),
  lastDowntime: integer("last_downtime", { mode: "timestamp_ms" }),
  
  // Heartbeat specific
  heartbeatToken: text("heartbeat_token"),
  heartbeatExpectedInterval: integer("heartbeat_expected_interval").default(60), // detik
  
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Monitor Logs
export const monitorLogs = sqliteTable("monitor_logs", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  status: text("status").notNull(), // up, down
  responseTime: integer("response_time"), // milliseconds
  statusCode: integer("status_code"),
  message: text("message"),
  checkedAt: integer("checked_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Status Pages (Public)
export const statusPages = sqliteTable("status_pages", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  description: text("description"),
  customDomain: text("custom_domain"),
  published: integer("published", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Status Page Monitors (many-to-many)
export const statusPageMonitors = sqliteTable("status_page_monitors", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  statusPageId: text("status_page_id").notNull().references(() => statusPages.id, { onDelete: "cascade" }),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  order: integer("order").default(0),
});

// Incidents
export const incidents = sqliteTable("incidents", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  severity: text("severity").default("major"), // minor, major, critical
  status: text("status").default("investigating"), // investigating, identified, monitoring, resolved
  startedAt: integer("started_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  resolvedAt: integer("resolved_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Notification Channels
export const notificationChannels = sqliteTable("notification_channels", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: text("type").notNull(), // email, telegram, discord, ntfy
  
  // Email
  emailTo: text("email_to"),
  
  // Telegram
  telegramChatId: text("telegram_chat_id"),
  telegramBotToken: text("telegram_bot_token"),
  
  // Discord
  discordWebhookUrl: text("discord_webhook_url"),
  
  // ntfy.sh
  ntfyTopic: text("ntfy_topic"),
  ntfyServer: text("ntfy_server").default("https://ntfy.sh"),
  
  active: integer("active", { mode: "boolean" }).default(true),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Monitor Notification Channels (many-to-many)
export const monitorNotificationChannels = sqliteTable("monitor_notification_channels", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  notificationChannelId: text("notification_channel_id").notNull().references(() => notificationChannels.id, { onDelete: "cascade" }),
});

// Notifications Log
export const notifications = sqliteTable("notifications", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  channelId: text("channel_id").notNull().references(() => notificationChannels.id, { onDelete: "cascade" }),
  type: text("type").notNull(), // down, up, timeout
  message: text("message").notNull(),
  sent: integer("sent", { mode: "boolean" }).default(false),
  error: text("error"),
  sentAt: integer("sent_at", { mode: "timestamp_ms" }),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});

// Maintenance Windows
export const maintenanceWindows = sqliteTable("maintenance_windows", {
  id: text("id").primaryKey().$defaultFn(() => createId()),
  monitorId: text("monitor_id").notNull().references(() => monitors.id, { onDelete: "cascade" }),
  title: text("title").notNull(),
  description: text("description"),
  startAt: integer("start_at", { mode: "timestamp_ms" }).notNull(),
  endAt: integer("end_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).$defaultFn(() => new Date()),
});
