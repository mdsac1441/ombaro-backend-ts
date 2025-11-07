import { boolean, pgTable, uuid, varchar, timestamp, index, uniqueIndex, jsonb, integer } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { auths } from ".";

/// Rate limiting and IP management
export const authRateLimits = pgTable("auth_rate_limits", {
  id: uuid().primaryKey().defaultRandom(),
  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }),
  
  /// Target identification
  email: varchar("email"),
  phone: varchar("phone"),
  ipAddress: varchar("ip_address", { length: 50 }).notNull(),
  
  /// Rate limiting details
  limitType: varchar("limit_type", { length: 50 }).notNull(), // login, password_reset, email_verify
  attemptCount: integer("attempt_count").default(0),
  windowStart: timestamp("window_start").notNull(),
  windowEnd: timestamp("window_end").notNull(),
  
  /// Status
  isBlocked: boolean("is_blocked").default(false),
  blockedReason: varchar("blocked_reason", { length: 255 }),

  blockedUntilAt: timestamp("blocked_until"),
  ...timestamps
}, (table) => [
  index("auth_rate_ip_type_idx").on(table.ipAddress, table.limitType),
  index("auth_rate_email_type_idx").on(table.email, table.limitType),
  index("auth_rate_window_end_idx").on(table.windowEnd),
  index("auth_rate_blocked_until_idx").on(table.blockedUntilAt),
]);