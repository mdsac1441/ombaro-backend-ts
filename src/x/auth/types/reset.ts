import { Elysia, t } from "elysia"
import { responseSchema } from "../../shared/types"

const verifyWithEmailSchemaRequest = t.Object({
    email: t.String({
        format: 'email'
    })
})

const verifyWithEmailSchemaResponse= t.Unknown()

export type VerifyWithEmail = typeof verifyWithEmailSchemaRequest.static


export const resetModelType = new Elysia()
    .model({
        "auth.reset.body": verifyWithEmailSchemaRequest,
        "auth.reset.response": responseSchema(verifyWithEmailSchemaResponse),
    })
