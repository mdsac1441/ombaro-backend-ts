import KycRepository from "../repositories/kyc";

export const userProfileService = async (userId: string, userData: any) => {
  try {
    // 1. Make sure base KYC request exists
    let existingKyc = await KycRepository.findKycByUserId(userId);
    if(!existingKyc){
      return {
        message: 'Kyc not initiated',
        data: false
      }
    }

    const kycId = existingKyc.id; // 👈 yeh required hai

   // 2. Check if profile already exists for this user
    const existingProfile = await KycRepository.findKycProfileByKycId(kycId);

    if (existingProfile) {
     throw new Error("KYC Profile already exists for this user, please update instead.");
    }

    // 2. Extract fields
    let {
      firstName,
      middleName,
      lastName,
      dateOfBirth,
      gender,
      nationality,
      taxResidency,
      ...rest
    } = userData;

    // Validate date
    if (!dateOfBirth || isNaN(Date.parse(dateOfBirth))) {
      throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
    }
    const dob = new Date(dateOfBirth).toISOString().split("T")[0];

    const metadata = Object.keys(rest).length > 0 ? rest : null;

    // 3. Insert into user_kyc_profiles
    const createdProfile = await KycRepository.createKycUserProfile({
      kycId, // 👈 required field
      userId,
      firstName,
      middleName,
      lastName,
      dateOfBirth: dob,
      gender,
      nationality,
      taxResidency,
      metadata,
    });

    // ✅ 5. Update parent user_kyc status → IN_PROGRESS
    await KycRepository.updateKycUser(kycId, { status: "IN_PROGRESS" });

    if (createdProfile) {
    return {
      message: "KYC Profile created & status moved to IN_PROGRESS",
      data: createdProfile,
    };
  }
   
    return createdProfile;
  } catch (error: any) {
    console.error("Error in userProfileService:", error);
    throw new Error(error.message || "Failed to create user profile");
  }
};
