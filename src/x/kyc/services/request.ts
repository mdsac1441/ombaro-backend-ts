import { profileMeService } from "../../user/services/profle/me";
import KycRepository from "../repositories/kyc";

export const requestUserService = async (userId: string) => {
  const data = await profileMeService(userId)
  if (!data.id) {
    throw new Error("unauthorized");
  }

  // Check if KYC already exists
  const existingReq = await KycRepository.findKycByUserId(data.id);

  if (existingReq) {
    return {
      message: "KYC request successfully",
      data: existingReq,
    };
  }

  // Create new KYC if not found
  const createdReq: any = await KycRepository.createKycUser({
    userId:data.id
  });

  return {
    message: "KYC request successfully created.",
    data: createdReq,
  };
};
