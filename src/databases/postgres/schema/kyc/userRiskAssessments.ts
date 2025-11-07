import { boolean, index, integer, jsonb, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { userAmlScreenings, userKyc } from ".";
import { assessmentStatusEnum, riskAssessmentTriggerEnum, riskLevelEnum } from "./enum";

/// Add this table for risk assessments
export const userRiskAssessments = pgTable("user_risk_assessments", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).notNull(),
    kycId: uuid("kyc_id").references(() => userKyc.id),
    amlScreeningId: uuid("aml_screening_id").references(() => userAmlScreenings.id),

    /// Assessment details
    trigger: riskAssessmentTriggerEnum("trigger").notNull(),
    overallScore: integer("overall_score").notNull(),
    overallLevel: riskLevelEnum("overall_level").notNull(),

    /// Breakdown of risk factors
    riskFactors: jsonb("risk_factors").$type<Array<{
        type: string;
        factor: string;
        score: number;
        weight: number;
        evidence?: string[];
    }>>(),

    /// Assessment status
    status: assessmentStatusEnum().notNull().default("REVIEW"),
    verifiedBy: uuid("verified_by").references(() => users.id),
    verifiedAt: timestamp("verified_at"),
    verifiedNotes: text("verified_notes"),

    /// Validity period
    validUntil: timestamp("valid_until"),
    isOverride: boolean("is_override").default(false),

    ...timestamps
}, (table) => [
    index("risk_user_idx").on(table.userId),
    index("risk_kyc_idx").on(table.kycId),
])