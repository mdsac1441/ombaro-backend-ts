import KycRepository from "../repositories/kyc";

export const verifyUserKycService = async (
  targetUserId: string,
  verifierId: string
) => {
  // 1️⃣ Fetch KYC of the target user
  const existingKyc = await KycRepository.findKycByUserId(targetUserId);
  if (!existingKyc) {
    throw new Error("KYC record not found for target user");
  }


  // 2️⃣ Call repository to mark KYC as APPROVED
  const verifiedKyc = await KycRepository.verifyUserKyc(targetUserId, verifierId);
  const verifiedBioKyc = await KycRepository.verifyUserBiometrics(targetUserId, verifierId);
//   const verifiedDoc = await KycRepository.verifyUserKycDoc(targetUserId, verifierId);

  console.log("Verified KYC:", verifiedKyc);
  return {
    message: "KYC verified successfully",
    data: {
      kyc: verifiedKyc,
      biometrics: verifiedBioKyc,
    //   document: verifiedDoc
    },
  };
};
