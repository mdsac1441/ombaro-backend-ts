import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const mfaCreateSchemaRequest = t.Object({
    secret: t.String(),
    type: t.Enum({
        APP: "APP",
        EMAIL: "EMAIL",
        SMS: "SMS",
        U2F: "U2F",
    }),
})

const mfaCreateSchemaResponse = t.Object({
    id: t.String()
})

export type MfaCreate = typeof mfaCreateSchemaRequest.static


export const mfaCreateModelType = new Elysia()
    .model({
        "auth.mfa.create.body": mfaCreateSchemaRequest,
        "auth.mfa.create.response": responseSchema(mfaCreateSchemaResponse),
    })