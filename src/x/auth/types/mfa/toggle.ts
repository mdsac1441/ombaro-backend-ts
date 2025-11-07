import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"

const mfaToggleSchemaRequest = t.Object({
    authId: t.String(),
    isEnabled: t.Boolean()
})

const mfaToggleSchemaResponse = t.Object({
    id: t.String(),
    isEnabled: t.Optional(t.Boolean())
})

export type MfaToggle = typeof mfaToggleSchemaRequest.static


export const mfaToggleModelType = new Elysia()
    .model({
        "auth.mfa.toggle.body": mfaToggleSchemaRequest,
        "auth.mfa.toggle.response": responseSchema(mfaToggleSchemaResponse),
    })