import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const verifyWithResetSchemaRequest = t.Object({
    token: t.String(),
    newPassword: t.String()
})

const verifyWithResetSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type VerifyWithReset = typeof verifyWithResetSchemaRequest.static


export const verifyWithResetModelType = new Elysia()
    .model({
        "auth.verify.reset.body": verifyWithResetSchemaRequest,
        "auth.verify.reset.response": responseSchema(verifyWithResetSchemaResponse),
    })