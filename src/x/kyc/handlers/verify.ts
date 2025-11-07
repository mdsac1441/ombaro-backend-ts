import { Elysia, t } from "elysia";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { verifyUserKycService } from "../services";
// Import verifyModelType from its module
import { verifyModelType } from "../types";

export const verifyKyc = new Elysia()
  .use(authMiddleware)
  .use(verifyModelType)
.post(
  "/verify",
  async ({ set, body, user }) => {
    try {
      const { userId } = body;

      if (!userId) {
        set.status = 400;
        return {
          success: false,
          code: 400,
          msg: "userId is required",
          data: null
        };
      }

      const verifiedKyc = await verifyUserKycService(userId, user as any);

      set.status = 200;
      return {
        success: true,
        code: 200,
        msg: "User KYC verified successfully",
        data: verifiedKyc,
      };
    } catch (error: any) {
      set.status = 500;
      return {
        success: false,
        code: 500,
        msg: error instanceof Error ? error.message : "KYC verification failed",
        data: null
      };
    }
  },
  {
    body: "kyc.verify.body",
    response: "kyc.verify.response",
  }
)