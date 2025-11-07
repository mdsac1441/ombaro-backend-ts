import { pgEnum } from "drizzle-orm/pg-core"

export const userStatusEnum = pgEnum("user_status", [
  'PENDING_VERIFICATION',
  'ACTIVE',
  'INACTIVE',
  'SUSPENDED',
  'FROZEN',
  'BANNED',
  'ARCHIVED',
  'CLOSED',
  'UNDER_REVIEW'
])
