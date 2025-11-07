import { Elysia, t } from "elysia";

import { responseSchema } from "../../shared/types";

const getUserSchemaRequest = t.Unknown()

const getUserSchemaResponse = t.Object({
  id: t.String(), // UUID of KYC entry
  userId: t.String(), // UUID of user

  level: t.String(), // enum (LEVEL_0, LEVEL_1, etc.)
  status: t.String(), // enum (NOT_STARTED, PENDING, VERIFIED, etc.)
});

export type UserGetStatus = typeof getUserSchemaRequest.static;

export const readOneModelType = new Elysia().model({
  "kyc.readOne.body": getUserSchemaRequest,
  "kyc.readOne.response": responseSchema(getUserSchemaResponse),
});



