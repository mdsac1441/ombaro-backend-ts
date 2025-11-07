import { pgTable, uuid, varchar, timestamp, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import timestamps from "../common";
import { announcementTypeEnum } from "./enum";

export const announcement = pgTable('announcements', {
  id: uuid('id').primaryKey().defaultRandom(),
  type: announcementTypeEnum('type').notNull(), /// GENERAL , INFO, WARNING, EVENT, UPDATE
  title: varchar('title', { length: 255 }).notNull(),
  content: varchar('content').notNull(),
  link: varchar('link'),
  status: boolean('status').default(true).notNull(),

  /// TO--DO

  ...timestamps,
}, (t) => [
  index('announce_type_idx').on(t.type),
])
