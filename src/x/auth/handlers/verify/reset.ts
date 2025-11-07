import Elysia from "elysia";
import { resetToken } from "../../../../middlewares/helpers";
import { verifyWithResetlService } from "../../services/verify";
import { verifyWithResetModelType } from "../../types/verify";
import { TokenType } from "../../../../databases/postgres/schema";


export const verifyResetEmail = new Elysia()
    .use(verifyWithResetModelType)
    .use(resetToken)
    .post('/reset', async ({ set, resetJwt, body }) => {
        try {
            const tokenPayload = await resetJwt.verify(body.token)
            if (!tokenPayload) {
                return {
                    success: false,
                    code: 401,
                    msg: 'Invalid reset verification token'
                }
            }
            const data = await verifyWithResetlService(tokenPayload,body.newPassword)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: data.message,
                data: {
                    cookies: {
                        ...data.cookies,
                        accessToken: await data.cookies?.accessToken,
                    }
                }
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
            body: 'auth.verify.reset.body',
            response: 'auth.verify.reset.response'
        });