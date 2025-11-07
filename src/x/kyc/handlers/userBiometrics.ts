import { Elysia, t } from "elysia";
import { uploadToCloudinaryV2 } from "../services/upload";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import KycRepository from "../repositories/kyc";
import { profileMeService } from "../../user/services/profle/me";



// 3. Elysia route
export const userBiometrics = new Elysia()
  .use(authMiddleware)
  .post(
    "/selfie",
    async ({ request, set, user }) => {
      try {
        const formData = await request.formData();
        const file = formData.get("face");


        if (!(file instanceof File)) {
          set.status = 400;
          return { error: "selfie is required" };
        }

        const data = await profileMeService(user as any)
        if (!data.id) {
          throw new Error("unauthorized");
        }

        // ✅ fetch user KYC record
        const kycRecord = await KycRepository.findKycByUserId(data.id as string);
        if (!kycRecord) {
          set.status = 404;
          return { error: "KYC record not found" };
        }

        const uploadedselfie = await uploadToCloudinaryV2(file, data.id);

        // ✅ save
        const savedDoc = await KycRepository.createBiometric(
          kycRecord.userId,
          uploadedselfie.secure_url
        );

        return {
          success: true,
          message: "Upload selfie successful",
          document: savedDoc,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          error: "Upload failed",
          details: error.message,
        };
      }
    },
    {}
  );