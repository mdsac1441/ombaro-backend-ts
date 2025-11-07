import { pgTable, uuid, varchar, timestamp, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import timestamps from "../common";
import { auths } from ".";
import { authDeviceSessions } from ".";
import { authAuditActionEnum } from ".";

export const authAuditLog = pgTable("auth_audit_logs", {
  id: uuid().primaryKey().defaultRandom(),
  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),
  deviceSessionId: uuid("device_session_id").references(() => authDeviceSessions.id, { onDelete: "set null" }),
  
  /// Action details
  action: authAuditActionEnum().notNull(),
  description: varchar("description", { length: 500 }),
  metadata: jsonb("metadata"), /// Store additional context data
  
  /// Quick reference (denormalized for performance)
  ipAddress: varchar("ip_address", { length: 50 }),
  
  /// Result and impact
  isSuccess: boolean("is_success").notNull(),
  errorMessage: varchar("error_message", { length: 500 }),
  impactScore: integer("impact_score").default(0), /// 0-100, indicates severity of the action

    ...timestamps
}, (table) => [
  index("auth_audit_auth_idx").on(table.authId),
  index("auth_audit_device_session_idx").on(table.deviceSessionId),
  index("auth_audit_action_idx").on(table.action),
  index("auth_audit_ip_address_idx").on(table.ipAddress),
  /// Composite index for common queries
  index("auth_audit_action_time_idx")
    .on(table.authId, table.action, table.createdAt),
]);