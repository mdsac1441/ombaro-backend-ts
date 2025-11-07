import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const mfaLoginSchemaRequest = t.Object({
    authId: t.String(),
    type: t.String(),
    otp: t.String()
})

const mfaLoginSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type MfaLogin = typeof mfaLoginSchemaRequest.static


export const mfaLoginModelType = new Elysia()
    .model({
        "auth.mfa.login.body": mfaLoginSchemaRequest,
        "auth.mfa.login.response": responseSchema(mfaLoginSchemaResponse),
    })