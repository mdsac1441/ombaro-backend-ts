import { index, integer, jsonb, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "../user"
import timestamps from "../common";
import { biometricVerificationStatus } from ".";

export const userBiometrics = pgTable("user_biometrics", {
  id: uuid().primaryKey().defaultRandom(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "cascade" }).unique().notNull(),

  /// Biometric References (encrypted references only - no raw data)
  biometricDataReferences: jsonb("biometric_data_refs").$type<{
    face?: string;
    fingerprint?: string;
    voice?: string;
    iris?: string;
  }>().notNull(),

  /// Verification Metadata
  provider: varchar("provider", { length: 50 }).notNull(), // E.g., "FaceTec", "Jumio"
  providerReference: varchar("provider_reference", { length: 256 }),
  deviceId: varchar("device_id"), // For device binding

  /// Security Scores
  livenessScore: integer("liveness_score").notNull(), // 0-100
  qualityScore: integer("quality_score").notNull(), // 0-100
  matchScore: integer("match_score"), // Against ID document

  /// Status Tracking
  status: biometricVerificationStatus().default("PENDING"),
  lastVerifiedAt: timestamp("last_verified_at"),
  expiresAt: timestamp("expires_at"), // Biometric data expiration
  verifiedBy: uuid("verified_by").references(() => users.id), // Admin/system

  /// Security Controls
  failedAttempts: integer("failed_attempts").default(0),
  lastAttemptAt: timestamp("last_attempt_at"),
  lockoutUntil: timestamp("lockout_until"),

  /// Compliance
  collectionMethod: varchar("collection_method", { length: 20 }).notNull(), // "LIVE_CAPTURE", "UPLOAD"
  collectionLocation: varchar("collection_location", { length: 2 }), // ISO country code
  consentVersion: varchar("consent_version", { length: 20 }).notNull(),

  ...timestamps
}, (table) => [
  index("biometrics_idx").on(table.userId),
  index("biometrics_status_idx").on(table.status),
  index("biometrics_provider_idx").on(table.provider),
]);