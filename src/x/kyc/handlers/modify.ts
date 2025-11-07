import { Elysia } from "elysia";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import { updateUserProfileService } from "../services";
import { modifyUserModelType } from "../types";

export const updateProfile = new Elysia()
  .use(authMiddleware)
  .use(modifyUserModelType)
  .put("/updateProfile", async ({ body, user, set }) => {
    try {
      const updated = await updateUserProfileService(user as string, body);
      return {
        success: true,
        code: 200,
        msg: "Profile updated successfully",
        data: updated,
      };
    } catch (error: any) {
      set.status = 400;
      return {
        success: false,
        code: 400,
        msg: "Profile update failed",
        error: {
          message: error.message,
          stack: error.stack,
        },
      };
    }
  },
    {
      body: "kyc.modify.body",
      response: "kyc.modify.response",
    }
);
