import { index, integer, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { kycLevelEnum, kycStatusEnum, kycVerificationMethodsEnum } from ".";


export const userKyc = pgTable('user_kyc', {
    id: uuid('id').primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).unique().notNull(),

    level: kycLevelEnum('level').notNull().default('LEVEL_0'),
    status: kycStatusEnum().notNull().default('NOT_STARTED'),
    verificationMethod: kycVerificationMethodsEnum('verification_method').default('MANUAL'),


    /// Verification Information
    verifiedAt: timestamp('verified_at'),
    verifiedBy: uuid('verified_by').references(() => users.id),
    verifiedNotes: varchar('verified_notes'),


    /// 3rd Party Verification
    verificationProvider: varchar("verification_provider"), /// Name of third-party KYC provider if used
    verificationReference: varchar("verification_reference"), /// Reference ID from verification provider
    verificationScore: integer("verification_score"), /// Score from verification system if applicable

    attemptsCount: integer("attempts_count").default(1), /// How many times user attempted this document verification
    lockoutUntil: timestamp("lockout_until"), /// Optional lockout after too many failed attempts

    ...timestamps
}, (t) => [
    index('kyc_user_idx').on(t.userId),
    index('kyc_status_idx').on(t.status),
    index('kyc_level_idx').on(t.level),
])