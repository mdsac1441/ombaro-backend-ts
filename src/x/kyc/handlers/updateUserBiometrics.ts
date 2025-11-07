import { Elysia } from "elysia";
import { uploadToCloudinaryV2 } from "../services/upload";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import KycRepository from "../repositories/kyc";

export const updateSelfie = new Elysia()
  .use(authMiddleware)
  .post("/updateSelfie", async ({ request, set, user }) => {
    try {
      const formData = await request.formData();
      const file = formData.get("face");

      if (!(file instanceof File)) {
        set.status = 400;
        return { error: "selfie is required" };
      }

      // ✅ fetch user KYC record
      const kycRecord = await KycRepository.findKycByUserId(user as string);
      if (!kycRecord) {
        set.status = 404;
        return { error: "KYC record not found" };
      }

      // ✅ upload selfie
      const uploadedSelfie = await uploadToCloudinaryV2(file, user);

      // ✅ update existing biometric record (face field only)
      const updatedDoc = await KycRepository.updateSelfie(
        kycRecord.userId,
        uploadedSelfie.secure_url
      );

      return {
        success: true,
        message: "Selfie updated successfully",
        document: updatedDoc,
      };
    } catch (error: any) {
      set.status = 500;
      return {
        error: "Update failed",
        details: error.message,
      };
    }
  });
