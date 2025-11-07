import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const signupWithGoogleSchemaRequest = t.Object({
    token: t.String(),
    referralCode: t.Optional(t.String())
})

const loginWithGoogleSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type SignupWithGoogle = typeof signupWithGoogleSchemaRequest.static


export const signupWithGooglelModelType = new Elysia()
    .model({
        "auth.signup.google.body": signupWithGoogleSchemaRequest,
        "auth.signup.google.response": responseSchema(loginWithGoogleSchemaResponse),
    })