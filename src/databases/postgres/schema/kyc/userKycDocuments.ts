import { boolean, date, index, integer, jsonb, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import timestamps from "../common";
import { kycDocumentTypesEnum } from ".";
import { userKyc } from ".";

export const userKycDocuments = pgTable('user_kyc_documents', {
    id: uuid('id').primaryKey().defaultRandom(),
    kycId: uuid('kyc_id').references(() => userKyc.id, { onDelete: 'cascade' }).unique().notNull(),

    documentType: kycDocumentTypesEnum('document_type').notNull(),
    documentData: jsonb('document_data'), /// JSON containing document details (e.g., number, expiry)

    documentImageFront: varchar('document_image_front', { length: 512 }), /// URL or path to front image
    documentImageBack: varchar('document_image_back', { length: 512 }), /// URL or path to back image if applicable

    isVerified: boolean('is_verified').default(false),
    verificationDetails: jsonb('verification_details'), /// JSON with verification results/details

    ...timestamps
}, (table) => [
    index('kyc_document_idx').on(table.kycId),
])
