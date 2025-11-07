import { boolean, index, inet, integer, pgTable, uuid, varchar } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { auths } from "."
import { authDeviceSessions } from "."

export const authLoginAttempts = pgTable("auth_login_attempts", {
  id: uuid().primaryKey().defaultRandom(),
  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),
  deviceSessionId: uuid("device_session_id").references(() => authDeviceSessions.id, { onDelete: "set null" }),

  email: varchar("email", { length: 255 }).notNull(),
  phone: varchar("phone"),

  /// Attempt details
  isSuccess: boolean("is_success").notNull(),
  reason: varchar("reason", { length: 255 }),
  attemptType: varchar("attempt_type", { length: 50 }).default("password").notNull(), /// password, mfa, social

  /// Quick reference (denormalized for performance)
  ipAddress: inet("ip_address").notNull(),

  /// Risk assessment
  suspiciousActivityScore: integer("suspicious_activity_score").default(0), /// 0-100
  isBlocked: boolean("is_blocked").default(false),

  ...timestamps
}, (table) => [
  index("auth_ttempts_auth_id_idx").on(table.authId),
  index("auth_attempts_email_idx").on(table.email),
  index("auth_attempts_device_session_idx").on(table.deviceSessionId),
  index("auth_attempts_ip_idx").on(table.ipAddress),
  /// Composite index for rate limiting queries
  index("auth_attempts_email_ip_time_idx")
    .on(table.email, table.ipAddress, table.createdAt),
])