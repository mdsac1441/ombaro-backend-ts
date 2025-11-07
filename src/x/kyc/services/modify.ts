import KycRepository from "../repositories/kyc";

export const updateUserProfileService = async (userId: string, userData: any) => {
  try {
    // 1. Base KYC request fetch karo
    const existingKyc = await KycRepository.findKycByUserId(userId);
    if (!existingKyc) {
      throw new Error("KYC record not found for this user");
    }

    const kycId = existingKyc.id;

    // 2. Check karo profile exist karta hai ya nahi
    const existingProfile = await KycRepository.findKycProfileByKycId(kycId);
    if (!existingProfile) {
      throw new Error("KYC Profile not found, please create first.");
    }

    // 3. Extract fields
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

    // Date validation
    let dob: string | undefined = undefined;
    if (dateOfBirth) {
      if (isNaN(Date.parse(dateOfBirth))) {
        throw new Error("Invalid dateOfBirth format. Use YYYY-MM-DD");
      }
      dob = new Date(dateOfBirth).toISOString().split("T")[0];
    }

    const metadata = Object.keys(rest).length > 0 ? rest : undefined;

    // ✅ Sirf wahi fields bhejo jo user ne send kiye hain
    const updateData: any = {};
    if (firstName !== undefined) updateData.firstName = firstName;
    if (middleName !== undefined) updateData.middleName = middleName;
    if (lastName !== undefined) updateData.lastName = lastName;
    if (dob !== undefined) updateData.dateOfBirth = dob;
    if (gender !== undefined) updateData.gender = gender;
    if (nationality !== undefined) updateData.nationality = nationality;
    if (taxResidency !== undefined) updateData.taxResidency = taxResidency;
    if (metadata !== undefined) updateData.metadata = metadata;

    // 4. Update profile
    const updatedProfile = await KycRepository.updateKycUserProfileByKycId(
      kycId,
      updateData
    );

    return {
      message: "KYC Profile updated successfully",
      data: updatedProfile,
    };
  } catch (error: any) {
    console.error("Error in updateUserProfileService:", error);
    throw new Error(error.message || "Failed to update user profile");
  }
};
