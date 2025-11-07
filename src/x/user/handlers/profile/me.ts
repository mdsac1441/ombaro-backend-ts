import Elysia from "elysia";
import { profileMeService } from "../../services/profle/me";
import { profileMeModelType } from "../../types/profle/me";
import { authMiddleware } from "../../../../middlewares/authMiddleware";

export const me = new Elysia()
    .use(profileMeModelType)
    .use(authMiddleware)
    .get('/me', async ({set, user }) => {
        try {

            const userData = await profileMeService(user as string);
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Profle Retrieved Successfully",
                data: userData
            };
        } catch (error) {
            set.status = 404;
            return {
                success: false,
                code: 402,
                msg: "No User Found",
                error: error
            };
        }
    });