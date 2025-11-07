import { Elysia, t } from "elysia";
import { uploadToCloudinaryV2 } from "../services/upload";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import KycRepository from "../repositories/kyc";
import { profileMeService } from "../../user/services/profle/me";
import { DBClient, userKycDocuments } from "../../../databases/postgres/schema";
import { eq } from "drizzle-orm";
import { tryCatch } from "bullmq";



// 3. Elysia route
export const upload = new Elysia()
  .use(authMiddleware)
  .post(
    "/upload",
    async ({ request, set, user }) => {
      try {
        const formData = await request.formData();
        const frontFile = formData.get("frontFile");
        const backFile = formData.get("backFile");
        const documentType = formData.get("documentType");

        if (!documentType) {
          set.status = 400;
          return { error: "documentType is required" };
        }

        if (!(frontFile instanceof File)) {
          set.status = 400;
          return { error: "documentImageFront is required" };
        }

        const data = await profileMeService(user as any)
        if (!data.id) {
          throw new Error("unauthorized");
        }


        // ✅ fetch user KYC record
        const kycRecord = await KycRepository.findKycByUserId(data.id as any);
        if (!kycRecord) {
          set.status = 404;
          return { error: "KYC record not found" };
        }

        const uploadedFront = await uploadToCloudinaryV2(frontFile, data.id);

        let uploadedBack = null;
        if (backFile && backFile instanceof File) {
          uploadedBack = await uploadToCloudinaryV2(backFile, data.id);
        }

        // const [existDoc] = await DBClient.select().from(userKycDocuments).where(
        //   eq(userKycDocuments.kycId, kycRecord.id)
        // ).limit(1)

        // if (!existDoc.id) {
        //   try {
        //     KycRepository.update
        //       (existDoc.id,
        //         {
        //           documentType: documentType as any,
        //           documentImageFront: uploadedFront.secure_url,
        //           documentImageBack: uploadedBack?.secure_url || null
        //         }
        //       )
        //   } catch (error) {

        //   }
        // }

        // ✅ save
        const savedDoc = await KycRepository.createKycDocuments({
          kycId: kycRecord.id,
          documentType: documentType as any,
          documentImageFront: uploadedFront.secure_url,
          documentImageBack: uploadedBack?.secure_url || null
        });

        return {
          success: true,
          message: "Upload successful",
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