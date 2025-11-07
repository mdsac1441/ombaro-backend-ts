import Elysia from "elysia";
import { verificationToken } from "../../../../middlewares/helpers";
import { verifyWithEmailService } from "../../services/verify";
import { verifyWithEmailModelType } from "../../types/verify";
import { TokenType } from "../../../../databases/postgres/schema";


export const verifyEmail = new Elysia()
    .use(verifyWithEmailModelType)
    .use(verificationToken)
    .post('/email', async ({ set, verificationJwt, body }) => {
        try {
            const tokenPayload = await verificationJwt.verify(body.token)
            if (!tokenPayload) {
                return {
                    success: false,
                    code: 401,
                    msg: 'Invalid verification token'
                }
            }
            const data = await verifyWithEmailService(tokenPayload,TokenType.VERIFICATION)
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
            body: 'auth.verify.email.body',
            response: 'auth.verify.email.response'
        });