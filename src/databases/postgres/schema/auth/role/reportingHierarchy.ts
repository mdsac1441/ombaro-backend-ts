import { boolean, index, jsonb, pgTable, timestamp, uniqueIndex, uuid } from "drizzle-orm/pg-core";
import { users } from "../../user";
import { departments } from "./departments";
import timestamps from "../../common";

export const reportingHierarchy = pgTable("reporting_hierarchy", {
    id: uuid("id").primaryKey().defaultRandom(),

    managerId: uuid("manager_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),

    subordinateId: uuid("subordinate_id")
        .references(() => users.id, { onDelete: "cascade" })
        .notNull(),

    departmentId: uuid("department_id").references(() => departments.id),

    isPrimary: boolean("is_primary").default(true),
    isActive: boolean("is_active").default(true),
    metadata: jsonb("metadata"),

    effectiveFrom: timestamp("effective_from").defaultNow().notNull(),
    effectiveTo: timestamp("effective_to"),
    ...timestamps,
}, (table) => [
    index("reporting_hierarchy_manager_idx").on(table.managerId),
    index("reporting_hierarchy_subordinate_idx").on(table.subordinateId),
    uniqueIndex("reporting_hierarchy_unique_idx")
        .on(table.managerId, table.subordinateId),
])

