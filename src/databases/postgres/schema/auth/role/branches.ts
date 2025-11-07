import { boolean, pgTable, uuid, index, text, jsonb, } from "drizzle-orm/pg-core"
import timestamps from "../../common"

export const branches = pgTable("branches", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),              /// Branch name (e.g., "Mumbai Office")
  code: text("code").unique(),                        /// Optional short code (e.g., "MUM")
  description: text("description"),                   /// Optional description
  metadata: jsonb("metadata"),                        /// Any custom data (like address, contact)
  isActive: boolean("is_active").default(true),       /// To enable/disable branch
  ...timestamps,                                      /// createdAt, updatedAt
}, (table) => [
  index("branches_name_idx").on(table.name),
])