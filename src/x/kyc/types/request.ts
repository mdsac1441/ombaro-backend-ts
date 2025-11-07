import { Elysia, t } from "elysia";

import { responseSchema } from "../../shared/types";

const userRequestSchemaRequest = t.Object({
  userId: t.String(),
});

const userRequestSchemaResponse = t.Object({
  id: t.String(), // UUID of KYC entry
  userId: t.String(), // UUID of user

  level: t.String(), // enum (LEVEL_0, LEVEL_1, etc.)
  status: t.String(), // enum (NOT_STARTED, PENDING, VERIFIED, etc.)
  verificationMethod: t.String(), // enum (MANUAL, AUTOMATIC, etc.)

  // Verification Info
  verifiedAt: t.Optional(t.String()), // ISO timestamp or null
  verifiedBy: t.Optional(t.String()), // UUID of verifier
  verifiedNotes: t.Optional(t.String()),

  // Third-Party Verification
  verificationProvider: t.Optional(t.String()),
  verificationReference: t.Optional(t.String()),
  verificationScore: t.Optional(t.Number()),

  // Attempts & Lockout
  attemptsCount: t.Number(),
  lockoutUntil: t.Optional(t.String()), // ISO timestamp or null

  createdAt: t.String(),
  updatedAt: t.Optional(t.String()),
  deleteAt: t.Optional(t.String()),
});

export type UserRequest = typeof userRequestSchemaRequest.static;

export const requestModelType = new Elysia().model({
  "kyc.request.body": userRequestSchemaRequest,
  "kyc.request.response": responseSchema(userRequestSchemaResponse),
});



