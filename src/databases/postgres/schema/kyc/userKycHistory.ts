import {index, jsonb, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { kycDocumentTypesEnum, kycHistoryActionEnum, kycLevelEnum, kycStatusEnum, userKycDocuments } from ".";
import { userKyc } from ".";

export const userKycHistory = pgTable("user_kyc_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  kycId: uuid("kyc_id").references(() => userKyc.id, { onDelete: "cascade" }).notNull(),

  /// Core tracking
  action: kycHistoryActionEnum("action").notNull(),
  previousLevel: kycLevelEnum("previous_level"),
  newLevel: kycLevelEnum("new_level"),
  previousStatus: kycStatusEnum("previous_status"),
  newStatus: kycStatusEnum("new_status"),

  /// Document reference (if applicable)
  documentId: uuid("document_id").references(() => userKycDocuments.id),

  /// Contextual data
  changeReason: varchar("change_reason", { length: 100 }),
  metadata: jsonb("metadata").$type<{
    source: "SYSTEM" | "API" | "ADMIN" | "AUTOMATION";
    ipAddress?: string;
    userAgent?: string;
  }>(),

  /// Verification details
  verifiedBy: uuid("verified_by").references(() => users.id),
  verifiedAt: timestamp("verified_at"),
  verificationNotes: text("verification_notes"),

  /// Temporal data
  effectiveFrom: timestamp("effective_from").defaultNow(),
  effectiveUntil: timestamp("effective_until"),

  ...timestamps
}, (table) => [
  index("kyc_history_idx").on(table.kycId),
  index("kyc_history_action_idx").on(table.action),
  index("kyc_history_time_idx").on(table.effectiveFrom, table.effectiveUntil),
]);