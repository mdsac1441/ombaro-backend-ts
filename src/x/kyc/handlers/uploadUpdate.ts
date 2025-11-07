import { Elysia } from "elysia";
import { uploadToCloudinaryV2 } from "../services/upload";
import { authMiddleware } from "../../../middlewares/authMiddleware";
import KycRepository from "../repositories/kyc";

export const updateDoc = new Elysia()
  .use(authMiddleware)
  .put(
    "/updateDoc",
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

        // ✅ fetch user KYC record (auth user ke base pe)
        const kycRecord = await KycRepository.findKycByUserId(user as string);
        if (!kycRecord) {
          set.status = 404;
          return { error: "KYC record not found" };
        }

        // ✅ check existing document
        const existingDoc = await KycRepository.findDocByKycIdAndType(
          kycRecord.id,
          documentType as any
        );
        if (!existingDoc) {
          set.status = 404;
          return { error: "No document found to update" };
        }

        // ✅ upload new files
        let uploadedFront = existingDoc.documentImageFront;
        if (frontFile && frontFile instanceof File) {
          uploadedFront = (await uploadToCloudinaryV2(frontFile, user))
            .secure_url;
        }

        let uploadedBack = existingDoc.documentImageBack;
        if (backFile && backFile instanceof File) {
          uploadedBack = (await uploadToCloudinaryV2(backFile, user))
            .secure_url;
        }

        // ✅ update karo
        const updatedDoc = await KycRepository.updateKycDocumentByUserId(
          user as string,
          {
            documentType,
            documentImageFront: uploadedFront,
            documentImageBack: uploadedBack,
            isVerified: false, // reset verification on update
          }
        );

        return {
          success: true,
          message: "Document updated successfully",
          document: updatedDoc,
        };
      } catch (error: any) {
        set.status = 500;
        return {
          error: "Update failed",
          details: error.message,
        };
      }
    },
    {}
  );
