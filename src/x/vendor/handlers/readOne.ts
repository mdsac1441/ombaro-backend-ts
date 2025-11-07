import Elysia from "elysia";
import { authMiddleware } from "../../../middlewares/authMiddleware";

export const readOne = new Elysia()
    .use(authMiddleware)
    .get('/read/one', async ({set, user }) => {
        try {

            const userData = "Todo: Fetch vendor data for user"
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Vendor Retrieved Successfully",
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