import { boolean, pgTable, uuid, jsonb, uniqueIndex, timestamp } from "drizzle-orm/pg-core"
import timestamps from "../../common"
import { users } from "../../user";
import { permissions } from ".";
import { roles } from ".";


export const rolePermissions = pgTable("role_permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  roleId: uuid("role_id").references(() => roles.id, { onDelete: "cascade" }).notNull(),
  permissionId: uuid("permission_id").references(() => permissions.id, { onDelete: "cascade" }).notNull(),
  grantedBy: uuid("granted_by").references(() => users.id),
  grantedAt: timestamp("granted_at").defaultNow().notNull(),
  overrides: jsonb("overrides"), /// For permission condition overrides

  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"), /// For additional context like IP restrictions

  expiresAt: timestamp("expires_at"), /// Optional expiration for the permission
    ...timestamps
}, (table) => [
  uniqueIndex("role_permissions_unique_idx")
    .on(table.roleId, table.permissionId),
])