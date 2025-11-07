import { boolean, integer, pgEnum, pgTable, uuid, varchar, index, text, jsonb, uniqueIndex, timestamp } from "drizzle-orm/pg-core"
import timestamps from "../../common"
import { users } from "../../user";
import { branches } from ".";
import { roles } from ".";
import { sql } from "drizzle-orm";



export const userRoles = pgTable("user_roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  branchId: uuid("branch_id").references(() => branches.id),

  grantedBy: uuid("granted_by").references(() => users.id),
  isPrimary: boolean("is_primary").default(false),
  isActive: boolean("is_active").default(true),
  /// Metadata for additional context like IP restrictions
  metadata: jsonb("metadata"), /// For additional context like IP restrictions

  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
    ...timestamps
}, (table) => [
  index("user_roles_user_idx").on(table.userId),
  index("user_roles_active_idx").on(table.userId, table.isActive),
  uniqueIndex("user_roles_unique_idx")
    .on(table.userId, table.roleId, table.branchId),
  uniqueIndex("user_roles_primary_unique_idx")
    .on(table.userId)
    .where(sql`is_primary = true`)
])