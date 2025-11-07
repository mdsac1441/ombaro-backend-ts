import Elysia from "elysia";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { referralReadOneService } from "../services/referral";

export const readOne = new Elysia()
    .use(authMiddleware)
    .get('/read/one', async ({set, user }) => {
        try {

            const userData = await referralReadOneService(user as string);
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Referral Retrieved Successfully",
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