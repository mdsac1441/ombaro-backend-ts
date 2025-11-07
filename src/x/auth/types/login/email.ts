import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const loginWithEmailSchemaRequest = t.Object({
    email: t.String({
        format: 'email'
    }),
    password: t.String(),
    recaptcha: t.Optional(t.String()),
})

const loginWithEmailSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
    })),
    mfa: t.Optional(t.Object({
        enabled: t.Boolean(),
        type: t.Array(t.String())
    })),
    authId: t.Optional(t.String())

})

export type LoginWithEmail = typeof loginWithEmailSchemaRequest.static


export const loginWithEmailModelType = new Elysia()
    .model({
        "auth.login.email.body": loginWithEmailSchemaRequest,
        "auth.login.email.response": responseSchema(loginWithEmailSchemaResponse),
    })