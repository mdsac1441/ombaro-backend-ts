import { pgTable, uuid, varchar, timestamp, jsonb, boolean, integer, index } from "drizzle-orm/pg-core";
import timestamps from "../common";
import { notificationTypeEnum } from "./enum";
import { users } from "../user";

export const notification = pgTable('notifications', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id).notNull(), /// User receiving the notification

  type: notificationTypeEnum().notNull(), /// Type of notification (e.g., SYSTEM, USER, ALERT)
  title: varchar('title', { length: 255 }).notNull(),
  content: varchar('content').notNull(),
  link: varchar('link'),
  icon: varchar('icon'), /// Optional icon for the notification
  isRead: boolean('is_read').default(false).notNull(), /// Whether the notification has been read
  
  readAt: timestamp('read_at'), /// Timestamp when the notification was read
  ...timestamps,
}, (t) => [
    index('notify_user_idx').on(t.userId),
    index('notify_type').on(t.type)
])
