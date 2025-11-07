import Elysia, { AnyElysia } from "elysia";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { mfaCreateModelType } from "../../types/mfa/create";
import { mfaCreateService } from "../../services/mfa/create";


export const create = new Elysia()
    .use(mfaCreateModelType)
    .use(authMiddleware)
    .post('/create', async ({ set, user, body }) => {
        try {
            const data = await mfaCreateService(body, user as any)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Mfa create successfully",
                data: data
            }
        } catch (error) {
            return {
                success: false,
                code: 500,
                msg: error instanceof Error ? error.message : "mfa Failed",
            }
        }
    },
        {
            body: 'auth.mfa.create.body',
            response: 'auth.mfa.create.response'
        }
    );