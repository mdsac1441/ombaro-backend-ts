import { boolean, pgTable, uuid, varchar, timestamp, index, uniqueIndex, jsonb, integer } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { auths } from ".";
import { authDeviceTypeEnum, sessionStatusEnum } from ".";

/// devices & session management
export const authDeviceSessions = pgTable("auth_devices_sessions", {
  id: uuid().primaryKey().defaultRandom(),
  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),
  
  /// Device Identification
  deviceId: varchar("device_id", { length: 255 }).notNull(),
  deviceFingerprint: varchar("device_fingerprint", { length: 512 }),
  deviceName: varchar("device_name", { length: 255 }),
  deviceType: authDeviceTypeEnum(), /// mobile, desktop, tablet

  /// Network Information
  ipAddress: varchar("ip_address", { length: 50 }).notNull(),
  userAgent: varchar("user_agent", { length: 1024 }),
  location: varchar("location", { length: 255 }),
  country: varchar("country", { length: 3 }), // ISO country code
  city: varchar("city", { length: 100 }),

  /// Session Status
  status: sessionStatusEnum().default("ACTIVE"),
  isTrusted: boolean("is_trusted").default(false),
  
  /// Trust details & Session Lifecycle
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
  trustedAt: timestamp("trusted_at"),
  trustExpiresAt: timestamp("trust_expires_at"),
  trustReason: varchar("trust_reason", { length: 255 }),

  /// Session Metadata
  loginMethod: varchar("login_method", { length: 50 }), /// password, social, mfa, webauthn
  sessionData: jsonb("session_data"), /// Additional session-specific data

  /// Risk Assessment
  riskScore: integer("risk_score").default(0), /// 0-100
  isAnomalous: boolean("is_anomalous").default(false),
  anomalyReasons: varchar("anomaly_reasons", { length: 10 }).array(),
  
  /// Status
  isActive: boolean("is_active").default(true),
  revokedAt: timestamp("revoked_at"),
  revokedReason: varchar("revoked_reason", { length: 255 }),
  
  ...timestamps
}, (table) => [
  index("auth_devices_auth_idx").on(table.authId),
  index("auth_devices_device_idx").on(table.deviceId),
  index("auth_devices_trust_expires_idx").on(table.trustExpiresAt),
  uniqueIndex("auth_idx_auth_device_unique")
    .on(table.authId, table.deviceId),
])