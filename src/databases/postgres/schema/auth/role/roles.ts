import { boolean, index, integer, jsonb, pgTable, text, uuid } from "drizzle-orm/pg-core";
import timestamps from "../../common";
import { departments } from "./departments";


export const roles = pgTable("roles", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  label: text("label").notNull(),
  description: text("description"),
  hierarchyLevel: integer("hierarchy_level").default(0),
  departmentId: uuid("department_id").references(() => departments.id),
  isSystemRole: boolean("is_system_role").default(false),
  isDeleted: boolean("is_deleted").default(false), /// Soft delete
  metadata: jsonb("metadata"),
  ...timestamps
}, (table) => [
  index("roles_hierarchy_idx").on(table.hierarchyLevel),
])