import Elysia,{t} from "elysia";
import { authMiddleware } from "../../../middlewares/authMiddleware";

export const readList = new Elysia()
    .use(authMiddleware)
    .get('/read/list', async ({set,query}) => {
        try {

            const userData = "Todo: Fetch vendor list data"
            set.status = 200;
            return {
                success: true,
                code: 200,
                msg: "Vendors Retrieved Successfully",
                data: userData
            };
        } catch (error) {
            set.status = 404;
            return {
                success: false,
                code: 402,
                msg: "No Data Found",
                error: error
            };
        }
    },{
        query: t.Object({
            id: t.String()
        })
    });