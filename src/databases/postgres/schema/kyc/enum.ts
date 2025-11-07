import { pgEnum } from "drizzle-orm/pg-core"

export const kycLevelEnum = pgEnum('kyc_level', [
    'LEVEL_0', /// (Email/Phone verify) 
    'LEVEL_1', /// Basic KYC (ID + Selfie) 
    'LEVEL_2', /// Enhanced KYC (Proof of Address + Source of Funds) 
    'LEVEL_3', /// Premium KYC (institutional) | Business docs + beneficial ownership.
])

export const kycStatusEnum = pgEnum('kyc_status', [
    'NOT_STARTED',
    'IN_PROGRESS',
    'PENDING_REVIEW',
    'APPROVED',
    'REJECTED',
    'EXPIRED',
    'RESUBMISSION_REQUIRED'
])

export const kycVerificationMethodsEnum = pgEnum("kyc_verification_methods", [
    "MANUAL",
    "AUTO",
])

export const kycDocumentTypesEnum = pgEnum("kyc_document_types", [
    "PASSPORT",
    "ID_CARD",
    "DRIVERS_LICENSE",
    "UTILITY_BILL",
    "BANK_STATEMENT",
    "PAYSLIP",
    "TAX_DOCUMENT",
    "VOTER_ID",
    "BIRTH_CERTIFICATE",
    "SOCIAL_SECURITY_CARD",
    "MILITARY_ID",
    "RESIDENCE_PERMIT",
    "NATIONAL_ID",
    "BUSINESS_LICENSE",
    "ARTICLES_OF_ASSOCIATION",
    "CERTIFICATE_OF_INCORPORATION",
    "PROOF_OF_ADDRESS",
    "PROOF_OF_INCOME"
])

export const amlScreeningTypeEnum = pgEnum("aml_screening_type", [
    'INITIAL',
    'PERIODIC',
    'AD_HOC',
    'ON_UPDATE'
])

export const amlVerifiedStatusEnum = pgEnum("aml_verified_status", [
    'PENDING',
    'CLEARED',
    'FLAGGED',
    'ESCALATED',
    'FALSE_POSITIVE'
])

export const riskLevelEnum = pgEnum("risk_level", [
    "LOW",
    "MEDIUM",
    "HIGH",
    "CRITICAL"
])

/// Compliance report types
export const riskAssessmentTriggerEnum = pgEnum("risk_assessment_trigger", [
    "ONBOARDING",
    "KYC_UPDATE",
    "TRANSACTION",
    "PERIODIC",
    "MANUAL_REVIEW",
    "AML_MATCH"
]);

export const riskFactorTypeEnum = pgEnum("risk_factor_type", [
    "GEOGRAPHIC",
    "OCCUPATIONAL",
    "BEHAVIORAL",
    "DOCUMENT",
    "NETWORK",
    "BUSINESS_RELATIONSHIP"
])

export const assessmentStatusEnum = pgEnum("assessment_status", [
    "ACCEPT",
    "REVIEW",
    "REJECT"
])

export const complianceReportTypeEnum = pgEnum("report_type", [
  "SAR", /// Suspicious Activity Report
  "CTR", /// Currency Transaction Report  
  "STR", /// Suspicious Transaction Report
  "KYC_REVIEW",
  "RISK_REVIEW",
  "REGULATORY_SUBMISSION",
  "AUDIT_TRAIL"
]);

export const complianceReportStatusEnum = pgEnum("compliance_status", [
  "DRAFT",
  "SUBMITTED",
  "ACKNOWLEDGED",
  "REJECTED",
  "ARCHIVED"
])

export const complianceReportActionEnum = pgEnum("compliance_report_action", [
  "FILE",
  "REVIEW",
  "ESCALATE",
  "APPROVE",
  "REJECT",
  "ARCHIVE"
]);

export const complianceReportPriorityEnum = pgEnum("compliance_report_priority", [
  "LOW",
  "MEDIUM",
  "HIGH",
  "URGENT"
]);

export const complianceReportCategoryEnum = pgEnum("compliance_report_category", [
  "FINANCIAL_CRIME",
  "REGULATORY_COMPLIANCE",
  "INTERNAL_CONTROL",
  "RISK_MANAGEMENT",
  "OPERATIONAL_RISK"
]);

export const complianceReportSourceEnum = pgEnum("compliance_report_source", [
  "INTERNAL",
  "EXTERNAL",
  "REGULATOR",
  "AUDIT",
  "USER_REPORT"
])

export const kycHistoryActionEnum = pgEnum("kyc_history_action", [
  "TIER_CHANGE",
  "STATUS_UPDATE",
  "DOCUMENT_UPLOAD",
  "DOCUMENT_VERIFICATION",
  "PROFILE_UPDATE",
  "LIMIT_ADJUSTMENT",
  "MANUAL_REVIEW",
  "AUTO_APPROVAL",
  "REJECTION",
  "EXPIRE"
])

export const biometricVerificationStatus = pgEnum("biometric_verification_status", [
  "PENDING",
  "PROCESSING",
  "VERIFIED",
  "REJECTED",
  "EXPIRED",
  "SUSPENDED"
]);

export const biometricTypeEnum = pgEnum("biometric_type", [
  "FACE",
  "FINGERPRINT",
  "VOICE_PRINT",
  "IRIS_SCAN",
  "BEHAVIORAL_BIOMETRICS"
]);













