import Elysia from "elysia";
import { userProfileService } from "../services";
import { submitUserModelType } from "../types";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { profileMeService } from "../../user/services/profle/me";

export const submit = new Elysia()
  .use(authMiddleware)
  // .use(submitUserModelType)
  .post(
    "/submit",
    async ({ set, body, user }) => {
      try {
        const data = await profileMeService(user as any)
        if (!data.id) {
          throw new Error("unauthorized");
        }

        const result = await userProfileService(data.id, body);

        set.status = 200;
        return {
          success: true,
          code: 200,
          msg: result.message,
          data: result.data
        };
      } catch (error) {
        set.status = 500;
        return {
          success: false,
          code: 500,
          msg: error instanceof Error ? error.message : "Request failed", // ✅ always string
          data: null,
        };
      }
    },
    {
      // body: "kyc.submit.body",
      // response: "kyc.submit.response",
    }
  );
