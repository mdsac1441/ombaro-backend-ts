import { Elysia, t } from "elysia"
import { responseSchema } from "../../../shared/types"


const profileMeSchemaResponse = t.Object({
    id: t.String(),
    nickName: t.Optional(t.String()),
    status: t.String()
})



export const profileMeModelType = new Elysia()
    .model({
        "user.profile.me.response": responseSchema(profileMeSchemaResponse),
    })