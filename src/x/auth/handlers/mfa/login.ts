import Elysia from "elysia";
import { verificationToken } from "../../../../middlewares/helpers";
import { verifyWithEmailService } from "../../services/verify";
import { TokenType } from "../../../../databases/postgres/schema";
import { mfaGenerateModelType } from "../../types/mfa";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { mfaLoginModelType } from "../../types/mfa/login";
import { mfaLoginService } from "../../services/mfa";


export const login = new Elysia()
    .use(mfaLoginModelType)
    .post('/login', async ({ set, body }) => {
        try {
            const data = await mfaLoginService(body)
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
                msg: error instanceof Error ? error.message : "mfa Failed",
            }
        }
    },
        {
            body: 'auth.mfa.login.body',
            response: 'auth.mfa.login.response'
        });