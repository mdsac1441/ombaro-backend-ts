import { t, TSchema } from "elysia"

export const responseSchema = <T extends TSchema>(dataSchema: T) =>
    t.Object({
        success: t.Boolean(),
        code: t.Number(),
        msg: t.String(),
        trace: t.Optional(t.String()),
        data: t.Optional(dataSchema),
        error: t.Optional(t.Object({
            message: t.String(),
            stack: t.String()
        }))
    })