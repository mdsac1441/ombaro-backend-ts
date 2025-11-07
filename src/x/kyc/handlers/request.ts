import Elysia, { t } from "elysia";
import { requestUserService } from "../services";
import { requestModelType } from "../types";
import { authMiddleware } from "../../../middlewares/authMiddleware";

export const request = new Elysia()
.use(authMiddleware)
// .use(requestModelType)
.post(
  "/request",
  async ({ set, user}) => {
    try {
      const data = await requestUserService(user as any);
      set.status = 200;
      return {
        success: true,
        code: 200,
        msg: data.message,
        data: data.data,
      };
    } catch (error) {
      return {
        success: false,
        code: 500,
        msg: error instanceof Error ? error.message :"request Failed",
       
      };
    }
  },
    // {
    //   body: "kyc.request.body",
    //   response: "kyc.request.response",
    // }
);