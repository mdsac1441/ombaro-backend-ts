import { timestamp } from "drizzle-orm/pg-core";

const timestamps = {
    updatedAt: timestamp("updated_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    deletedAt: timestamp("deleted_at"),
}

export default timestamps;