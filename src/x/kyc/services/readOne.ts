import { profileMeService } from "../../user/services/profle/me";
import KycRepository from "../repositories/kyc";

export const getUserKycService = async (userId: string) => {

  const data = await profileMeService(userId)
  if (!data.id) {
    throw new Error("unauthorized");
  }
  const existingReq = await KycRepository.findKycByUserId(data.id);

  if (!existingReq) {
    return {
      message: "No KYC request found for this user.",
      data: false,
    };
  }

  return {
    message: "KYC request fetched successfully.",
    data: existingReq,
  };
};
