import { boolean, index, integer, pgEnum, pgTable, serial, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core";
import timestamps from "../common";
import { auths } from "../auth/auths";
import { userStatusEnum } from ".";

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  uid: varchar("uid",{length: 11}).notNull().unique(),
  authId: uuid("auth_id").references(() => auths.id, { onDelete: "cascade" }).notNull(),
  nickName: varchar("nick_name", { length: 12 }).unique(),
  avatar: varchar("avatar", { length: 255 }).default(""),/// Profile picture URL
  bio: varchar("bio", { length: 255 }).default(""),
  status: userStatusEnum().default('ACTIVE'),

  /// Account management
  statusUpdatedAt: timestamp("status_updated_at"),
  statusUpdatedBy: uuid("status_updated_by"), /// Admin who changed status
  statusReason: varchar("status_reason", { length: 255 }), /// Reason for suspension/ban

  /// Compliance
  marketingConsent: boolean("marketing_consent").default(false),
  acceptedTermsAt: timestamp("accepted_terms_at"),
  acceptedPrivacyAt: timestamp("accepted_privacy_at"),

  ...timestamps
},(t) => [
  /// Primary indexes
 index("users_auth_id_idx").on(t.authId),
 index("users_uid_idx").on(t.uid),
  
  /// Business logic indexes
  index("users_status_idx").on(t.status),
  
  /// Unique constraints
   uniqueIndex("users_auth_id_unique").on(t.authId),
])

