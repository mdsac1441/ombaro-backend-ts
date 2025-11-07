import { boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { amlScreeningTypeEnum, amlVerifiedStatusEnum, riskLevelEnum } from ".";

export const userAmlScreenings = pgTable("user_aml_screenings", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),

    /// Screening metadata
    screeningType: amlScreeningTypeEnum("screening_type").notNull(),
    screeningProvider: varchar("screening_provider").notNull(),
    providerReference: varchar("provider_reference"),

    /// Results
    rawRiskScore: integer("raw_risk_score"),
    normalizedRiskScore: integer("normalized_risk_score"),
    riskLevel: riskLevelEnum("risk_level"),

    /// Match details (type-specific)
    matchDetails: jsonb("match_details").$type<{
        sanctions?: Array<{
            list: string;
            matchStrength: number;
        }>;
        pep?: {
            position: string;
            jurisdiction: string;
            years: string;
        };
        adverseMedia?: Array<{
            source: string;
            date: string;
            keywords: string[];
        }>;
    }>(),

    /// Verification Information
    status: amlVerifiedStatusEnum().default("PENDING"),
    verifiedBy: uuid("verified_by").references(() => users.id),
    verifiedAt: timestamp("verified_at"),
    verifiedNotes: text("verified_notes"),

    /// Rescreening
    nextScreeningDue: timestamp("next_screening_due"),
    isRecurring: boolean("is_recurring").default(false),

    ...timestamps
}, (table) => [
    index("aml_screening_idx").on(table.userId, table.screeningType),
    index("aml_status_idx").on(table.status),
])