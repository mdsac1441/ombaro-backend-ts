import Elysia, { t } from "elysia";
import { getUserKycService } from "../services/readOne";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { readOneModelType } from "../types";


export const getUserStatus = new Elysia()
.use(authMiddleware)
// .use(readOneModelType)
.get(
    "/status",
async ({  set, user }) => {
    try {
      const data = await getUserKycService(user as any);

      set.status = 200;
      return {
        success: true,
        code: 200,
        msg: data.message,
        data: data.data,
      };
    } catch (err) {
      set.status = 500;
      return {
        success: false,
        code: 500,
        msg: "Something went wrong",
        error: err,
      };
    }
  },
  {
      // body: "kyc.readOne.body",
      // response: "kyc.readOne.response",
    }
);
