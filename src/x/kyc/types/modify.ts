import { Elysia, t } from "elysia";

import { responseSchema } from "../../shared/types";

// ✅ sab fields optional kardo update ke liye
const modifyUserSchemaRequest = t.Object({
  firstName: t.Optional(t.String()),
  middleName: t.Optional(t.String()),
  lastName: t.Optional(t.String()),
  dateOfBirth: t.Optional(t.String()), // ISO date
  gender: t.Optional(t.String()),
  nationality: t.Optional(t.String()),
  taxResidency: t.Optional(t.String()),
  metadata: t.Optional(t.Record(t.String(), t.Any())),
});

const modifyUserSchemaResponse = t.Object({
  id: t.String(), // UUID of KYC entry
  firstName: t.String(),
  middleName: t.Optional(t.String()),
  lastName: t.String(),
  dateOfBirth: t.String(), // ISO date
  gender: t.String(),
  nationality: t.String(),
  taxResidency: t.String(),
  metadata: t.Optional(t.Record(t.String(), t.Any())),
});

export type UpdateProfile = typeof modifyUserSchemaRequest.static;

export const modifyUserModelType = new Elysia().model({
  "kyc.modify.body": modifyUserSchemaRequest,
  "kyc.modify.response": responseSchema(modifyUserSchemaResponse),
});
