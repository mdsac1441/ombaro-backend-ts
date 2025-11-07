import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const signupWithEmailSchemaRequest = t.Object({
    email: t.String({
        format: 'email'
    }),
    password: t.String(),
    consent: t.Boolean(),
    referralCode: t.Optional(t.String()),
})

const signupWithEmailSchemaResponse = t.Object({
    cookies: t.Optional(
        t.Object({
            accessToken: t.Optional(t.String()),
            csrfToken: t.Optional(t.String()),
            sessionId: t.Optional(t.String()),
        })),
})

export type SignupWithEmail = typeof signupWithEmailSchemaRequest.static


export const signupWithEmailModelType = new Elysia()
    .model({
        "auth.signup.email.body": signupWithEmailSchemaRequest,
        "auth.signup.email.response": responseSchema(signupWithEmailSchemaResponse),
    })