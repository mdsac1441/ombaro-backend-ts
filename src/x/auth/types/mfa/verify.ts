import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const mfaVerifySchemaRequest = t.Object({
    secret: t.String(),
    otp: t.String(),
    type: t.Enum({
        APP: "APP",
        EMAIL: "EMAIL",
        SMS: "SMS",
        U2F: "U2F",
    }),
})

const mfaVerifySchemaResponse = t.Object({
    id: t.String()
})

export type MfaVerify = typeof mfaVerifySchemaRequest.static


export const mfaVerifyModelType = new Elysia()
    .model({
        "auth.mfa.verify.body": mfaVerifySchemaRequest,
        "auth.mfa.verify.response": responseSchema(mfaVerifySchemaResponse),
    })