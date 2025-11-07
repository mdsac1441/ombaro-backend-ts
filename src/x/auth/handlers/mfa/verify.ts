import Elysia from "elysia";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { mfaVerifyService } from "../../services/mfa/verify";
import { mfaVerifyModelType } from "../../types/mfa/verify";


export const verify = new Elysia()
    .use(mfaVerifyModelType)
    .use(authMiddleware)
    .post('/verify', async ({ set, user, body }) => {
        try {
            const data = await mfaVerifyService(body, user as any)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Mfa verify successfully",
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
            body: 'auth.mfa.verify.body',
            response: 'auth.mfa.verify.response'
        }
    );