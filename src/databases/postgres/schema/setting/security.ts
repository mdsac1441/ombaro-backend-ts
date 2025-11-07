
import { boolean, integer, pgTable, uuid, varchar, timestamp, index } from "drizzle-orm/pg-core"
import timestamps from "../common"
import { users } from "../user"

/// Enhanced security settings
export const securitySettings = pgTable("security_settings", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),

  /// Notification preferences
  loginNotifications: boolean("login_notifications").default(true),
  withdrawalNotifications: boolean("withdrawal_notifications").default(true),
  securityAlerts: boolean("security_alerts").default(true),
  
  /// Security features
  withdrawalWhitelist: boolean("withdrawal_whitelist").default(false),
  antiPhishingCode: varchar("anti_phishing_code", { length: 20 }),
  
  /// Account locks and restrictions
  passwordResetLock: boolean("password_reset_lock").default(false),
  passwordResetLockUntil: timestamp("password_reset_lock_until"),
  accountLock: boolean("account_lock").default(false),
  accountLockUntil: timestamp("account_lock_until"),
  accountLockReason: varchar("account_lock_reason", { length: 255 }),
  
  /// Multi-factor authentication
  mfaEnforced: boolean("mfa_enforced").default(false),
  mfaGracePeriodUntil: timestamp("mfa_grace_period_until"),
  
  /// Session management
  maxConcurrentSessions: integer("max_concurrent_sessions").default(5),
  sessionTimeout: integer("session_timeout").default(3600), // seconds
  deviceTrustDuration: integer("device_trust_duration").default(2592000), // 30 days in seconds
  
  /// Geographic restrictions
  allowedCountries: varchar("allowed_countries", { length: 3 }).array(), /// ISO 3166-1 alpha-3 codes
  blockedCountries: varchar("blocked_countries", { length: 3 }).array(),
  /// Geo-restriction enabled
  /// This can be used to enable/disable geo-restrictions without removing the data
  /// Useful for temporary changes or testing
  /// If enabled, only allowedCountries are permitted, and blockedCountries are denied
  /// If disabled, all countries are allowed
  geoRestrictionEnabled: boolean("geo_restriction_enabled").default(false),
  
  /// Password policies
  passwordExpiryDays: integer("password_expiry_days").default(90),
  passwordHistoryCount: integer("password_history_count").default(5),
  
  ...timestamps,
}, (table) => ({
  authIdIdx: index("auth_security_settings_auth_id_idx").on(table.userId),
}))