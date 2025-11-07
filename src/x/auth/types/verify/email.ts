import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const verifyWithEmailSchemaRequest = t.Object({
    token: t.String()
})

const verifyWithEmailSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type VerifyWithEmail = typeof verifyWithEmailSchemaRequest.static


export const verifyWithEmailModelType = new Elysia()
    .model({
        "auth.verify.email.body": verifyWithEmailSchemaRequest,
        "auth.verify.email.response": responseSchema(verifyWithEmailSchemaResponse),
    })