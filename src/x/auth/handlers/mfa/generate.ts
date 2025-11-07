import Elysia from "elysia";
import { verificationToken } from "../../../../middlewares/helpers";
import { verifyWithEmailService } from "../../services/verify";
import { TokenType } from "../../../../databases/postgres/schema";
import { mfaGenerateModelType } from "../../types/mfa";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { mfaGenerateService } from "../../services/mfa";


export const generate = new Elysia()
    .use(mfaGenerateModelType)
    .use(authMiddleware)
    .post('/generate', async ({ set, user, body }) => {
        try {
            const data = await mfaGenerateService(body,user as any)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Mfa generate successfully",
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
            body: 'auth.mfa.generate.body',
            response: 'auth.mfa.generate.response'
        });