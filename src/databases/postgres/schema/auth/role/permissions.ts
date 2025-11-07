import { boolean, integer, pgEnum, pgTable, uuid, varchar, index, text, jsonb, uniqueIndex, timestamp } from "drizzle-orm/pg-core"
import timestamps from "../../common"

export const permissions = pgTable("permissions", {
  id: uuid("id").primaryKey().defaultRandom(),
  key: text("key").notNull().unique(), /// Composite of resource:action:scope
  resource: varchar("resource", { length: 50 }).notNull(),
  action: varchar("action", { length: 50 }).notNull(),
  scope: varchar("scope", { length: 50 }).default('own'),
  conditions: jsonb("conditions"),
  label: text("label").notNull(),
  description: text("description"),
  isDeleted: boolean("is_deleted").default(false), /// Soft delete
  metadata: jsonb("metadata"),
  ...timestamps
}, (table) => [
  uniqueIndex("permissions_resource_action_scope_idx")
    .on(table.resource, table.action, table.scope),
])