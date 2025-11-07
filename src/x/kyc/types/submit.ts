import { Elysia, t } from "elysia";

import { responseSchema } from "../../shared/types";

const submitUserSchemaRequest = t.Object({
  firstName: t.String(),
  middleName: t.Optional(t.String()),
  lastName: t.String(),
  dateOfBirth: t.String(), // ISO date
  gender: t.String(),
  nationality: t.String(),
  taxResidency: t.String(),
  metadata: t.Optional(t.Record(t.String(), t.Any())),

});

const submitUserSchemaResponse = t.Object({
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

export type UserProfile = typeof submitUserSchemaRequest.static;

export const submitUserModelType = new Elysia().model({
  "kyc.submit.body": submitUserSchemaRequest,
  "kyc.submit.response": responseSchema(submitUserSchemaResponse),
});



