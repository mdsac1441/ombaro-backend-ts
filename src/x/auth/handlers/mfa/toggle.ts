import Elysia from "elysia";
import { authMiddleware } from "../../../../middlewares/authMiddleware";
import { mfaToggleModelType } from "../../types/mfa/toggle";
import { mfaCreateService } from "../../services/mfa/create";
import { mfaToggleService } from "../../services/mfa/toggle";


export const create = new Elysia()
    .use(mfaToggleModelType)
    .use(authMiddleware)
    .post('/create', async ({ set, user, body }) => {
        try {
            const data = await mfaToggleService(body, user as any)
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Mfa create successfully",
                data: {
                    ...data,
                    isEnabled: data.isEnabled as any
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
            body: 'auth.mfa.toggle.body',
            response: 'auth.mfa.toggle.response'
        }
    );