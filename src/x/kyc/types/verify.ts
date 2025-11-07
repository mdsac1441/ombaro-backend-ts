import { Elysia, t } from "elysia";

import { responseSchema } from "../../shared/types";

const verifyRequestSchemaRequest = t.Object({
  userId: t.String(),
});

const verifyRequestSchemaResponse = t.Object({
  id: t.String(), // UUID of KYC entry
  level: t.String(), // enum (LEVEL_0, LEVEL_1, etc.)
  status: t.String(), // enum (NOT_STARTED, PENDING, VERIFIED, etc.)

  // Verification Info
  verifiedAt: t.Optional(t.String()), // ISO timestamp or null
  verifiedBy: t.Optional(t.String()), // UUID of verifier
  verifiedNotes: t.Optional(t.String()),

});

export type VerifyUser = typeof verifyRequestSchemaRequest.static;

export const verifyModelType = new Elysia().model({
  "kyc.verify.body": verifyRequestSchemaRequest,
  "kyc.verify.response": responseSchema(verifyRequestSchemaResponse),
});



