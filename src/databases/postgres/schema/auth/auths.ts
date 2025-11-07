import { boolean, pgEnum, pgTable, uuid, varchar, timestamp, index, jsonb } from "drizzle-orm/pg-core"
import timestamps from "../common"

export const auths = pgTable("auths", {
  id: uuid().primaryKey().defaultRandom(),
  email: varchar("email").unique().notNull(),
  phone: varchar("phone"),

  isEmailVerified: boolean("is_email_verified").default(false),
  isPhoneVerified: boolean("is_phone_verified").default(false),

  password: varchar("password"),
  passwordChangedAt: timestamp("password_changed_at"),

  metadata: jsonb("metadata"), /// Store additional user-specific data

  /// Compliance and lifecycle
  consentAt: timestamp("consent_at"),
  retentionUntil: timestamp("retention_until_at"),
  anonymizationAt: timestamp("anonymization_at"),

  emailVerifiedAt: timestamp('email_verified_at'),
  lastLoginAt: timestamp("last_login_at"),
  lastActivityAt: timestamp("last_activity_at"),
  ...timestamps
}, (table) => [
  index("auths_email_idx").on(table.email),
  index("auths_phone_idx").on(table.phone),
])










