import Elysia from "elysia";
import { resetModelType } from "../types/reset";
import { resetService } from "../services/reset";


export const xReset = new Elysia()
    .use(resetModelType)
    .post('/reset', async ({ set, body }) => {
        try {

            const data = await resetService(body.email)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: data.message,
            }
        } catch (error) {
            return {
                success: false,
                code: 500,
                msg: error instanceof Error ? error.message : "verification Failed",
            }
        }
    },
        {
            body: 'auth.reset.body',
            response: 'auth.reset.response'
        });