import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const mfaGenerateSchemaRequest = t.Object({
    type: t.Enum({
        APP: "APP",
        EMAIL: "EMAIL",
        SMS: "SMS",
        U2F: "U2F",
    }),
    phone: t.Optional(t.String())
})

const mfaGenerateSchemaResponse = t.Object({
    secret: t.Optional(t.String()),
    qrcode: t.Optional(t.String())
})

export type MfaGenerate = typeof mfaGenerateSchemaRequest.static


export const mfaGenerateModelType = new Elysia()
    .model({
        "auth.mfa.generate.body": mfaGenerateSchemaRequest,
        "auth.mfa.generate.response": responseSchema(mfaGenerateSchemaResponse),
    })