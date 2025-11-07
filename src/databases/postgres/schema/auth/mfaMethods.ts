import {
    pgTable,
    uuid,
    boolean,
    timestamp,
    varchar,
    integer,
    jsonb,
    index,
    text
} from "drizzle-orm/pg-core";
import { auths } from ".";
import timestamps from "../common";
import { mfaSecurityActionEnum, mfaTypeEnum } from ".";



export const mfaMethods = pgTable("mfa_methods", {
    id: uuid("id").primaryKey().defaultRandom(),
    authId: uuid("auth_id").notNull().references(() => auths.id, { onDelete: "cascade" }),
    type: mfaTypeEnum("type").notNull(),
    isEnabled: boolean("is_enabled").default(false),
    isPrimary: boolean("is_primary").default(false),
    secret: text("secret"), /// encrypted 
    recoveryCodes: text("recovery_codes").array(),
    backupCodesUsed: integer("backup_codes_used").default(0),
    /// last successful TOTP code/counter to prevent replay (for HOTP or reuse)
    lastUsedCode: varchar("last_used_code", { length: 128 }).default(""),

    metadata: jsonb("metadata"), /// phone, email override, device binding info

    enabledAt: timestamp("enabled_at"),
    lastUsedAt: timestamp("last_used_at"),
    ...timestamps
}, (t) => [
    index("two_factor_auth_idx").on(t.authId),
    index("two_factor_type_idx").on(t.type),
    index("two_factor_enabled_idx").on(t.isEnabled)
])

export const twoFactorPolicies = pgTable("mfa_policies", {
  id: uuid("id").primaryKey().defaultRandom(),
  authId: uuid("user_id").notNull().references(() => auths.id, { onDelete: "cascade" }),
  action: mfaSecurityActionEnum().notNull(),
  /// array of required methods, e.g. ["APP"], or ["APP", "EMAIL"]
  requiredMethods: mfaTypeEnum("required_methods").array().notNull(),
  ...timestamps
}, (t) => [
  index("mfa_policy_auth_idx").on(t.authId),
  index("mfa_policy_action_idx").on(t.action),
  index("mfa_policy_required_idx").on(t.requiredMethods)
])
