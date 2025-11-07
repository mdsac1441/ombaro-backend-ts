import { pgTable, uuid, text, boolean, jsonb, index } from "drizzle-orm/pg-core";
import timestamps from "../../common";
import { users } from "../../user";

export const departments = pgTable("departments", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  code: text("code").notNull().unique(),
  description: text("description"),
  headId: uuid("head_id").references(() => users.id),
  parentId: uuid("parent_id").references(():any => departments.id,{ onDelete: "set null" }),
  isActive: boolean("is_active").default(true),
  metadata: jsonb("metadata"),
  ...timestamps,
}, (table) => [
  index("departments_name_idx").on(table.name)
])
