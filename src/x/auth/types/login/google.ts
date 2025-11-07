import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const loginWithGoogleSchemaRequest = t.Object({
    token: t.String(),
})

const loginWithGoogleSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type LoginWithGoogle = typeof loginWithGoogleSchemaRequest.static


export const loginWithGooglelModelType = new Elysia()
    .model({
        "auth.login.google.body": loginWithGoogleSchemaRequest,
        "auth.login.google.response": responseSchema(loginWithGoogleSchemaResponse),
    })