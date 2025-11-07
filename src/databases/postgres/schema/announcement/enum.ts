import { pgEnum } from "drizzle-orm/pg-core"


export const announcementTypeEnum = pgEnum('announcement_type', [
  'GENERAL',
  'INFO',
  'WARNING',
  'EVENT',
  'UPDATE',
])