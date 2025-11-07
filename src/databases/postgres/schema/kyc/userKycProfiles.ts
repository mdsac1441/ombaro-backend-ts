import {boolean, date, index, jsonb, pgTable, timestamp, uuid, varchar,integer } from "drizzle-orm/pg-core"
import timestamps from "../common";
import { riskLevelEnum } from ".";
import { userKyc } from ".";


export const userKycProfiles = pgTable('user_kyc_profiles', {
    id: uuid('id').primaryKey().defaultRandom(),
    kycId: uuid('kyc_id').references(() => userKyc.id, { onDelete: 'cascade' }).notNull(),

    /// Personal Information
    firstName: varchar("first_name"),
    middleName: varchar("middle_name"),
    lastName: varchar("last_name"),
    dateOfBirth: date("date_of_birth"),
    gender: varchar("gender"),
    nationality: varchar("nationality"),
    taxResidency: varchar("tax_residency"),
    taxId: varchar("tax_id"),

    /// Business Information (for businesses)
    companyName: varchar("company_name"),
    companyRegistrationNumber: varchar("company_registration_number"),
    companyTaxId: varchar("company_tax_id"),
    companyIncorporationCountry: varchar("company_incorporation_country"),
    companyIncorporationDate: timestamp("company_incorporation_date"),

    //// Risk summary
    currentRiskScore: integer("current_risk_score").default(0),
    currentRiskLevel: riskLevelEnum("current_risk_level").default("MEDIUM"),
    lastRiskAssessment: timestamp("last_risk_assessment"),
    nextRiskAssessment: timestamp("next_risk_assessment"),

    /// Persistent risk indicators
    isHighRiskJurisdiction: boolean("is_high_risk_jurisdiction").default(false),
    isHighRiskOccupation: boolean("is_high_risk_occupation").default(false),

    /// Metadata
    metadata: jsonb("metadata"),
    version: integer("version").default(1),

    ...timestamps
}, (t) => [
    index('kyc_profile_idx').on(t.kycId),
])