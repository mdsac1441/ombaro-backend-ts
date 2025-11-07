import { index, integer, jsonb, pgEnum, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { complianceReportActionEnum, complianceReportCategoryEnum, complianceReportPriorityEnum, complianceReportSourceEnum, complianceReportStatusEnum, complianceReportTypeEnum } from ".";

export const userComplianceReports = pgTable("user_compliance_reports", {
    id: uuid().primaryKey().defaultRandom(),
    userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),

    /// Core report metadata
    reportType: complianceReportTypeEnum().notNull(),
    internalReference: varchar("internal_reference", { length: 50 }).notNull().unique(),

    /// Temporal data
    eventDate: timestamp("event_date").notNull(),
    reportPeriodStart: timestamp("report_period_start"),
    reportPeriodEnd: timestamp("report_period_end"),

    /// Content and details
    reason: varchar("reason", { length: 100 }).notNull(), // Short reason code
    details: jsonb("details").notNull().$type<{
        narrative: string;
        indicators: string[];
        transactions?: string[]; // Transaction IDs
        parties?: Array<{
            type: "originator" | "beneficiary";
            userId?: string;
            externalName?: string;
        }>;
    }>(),

    /// Attachments 
    documents: jsonb("documents").$type<Array<{
        type: string;
        storageRef: string;
        hash: string;
    }>>(),

    /// Regulatory info
    regulator: varchar("regulator", { length: 50 }), // FINCEN, FCA, etc.
    externalReference: varchar("external_reference", { length: 100 }),
    submissionDeadline: timestamp("submission_deadline"),

    /// Workflow
    status: complianceReportStatusEnum().default("DRAFT"),
    priority: complianceReportPriorityEnum("priority").default("MEDIUM"),
    category: complianceReportCategoryEnum("category").default("FINANCIAL_CRIME"),
    source: complianceReportSourceEnum("source").default("INTERNAL"),
    action: complianceReportActionEnum("action").default("FILE"),
    assignedTo: uuid("assigned_to").references(() => users.id),
    
    filedAt: timestamp("filed_at"),
    filedBy: uuid("filed_by").references(() => users.id),
    verifieddAt: timestamp("verified_at"),
    verifiedBy: uuid("verified_by").references(() => users.id),

    /// Audit
    version: integer("version").default(1),
    previousVersionId: uuid("previous_version_id"), /// For report updates

    ...timestamps
}, (table) => [
    index("compliance_user_idx").on(table.userId),
    index("compliance_type_status_idx").on(table.reportType, table.status),
    index("compliance_deadline_idx").on(table.submissionDeadline),
    index("compliance_ref_idx").on(table.internalReference),
]);