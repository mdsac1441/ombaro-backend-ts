import ReferralRepository from "../../referral/repositories";

export const handleReferralForSignup = async (referralCode: string,userId:string) => {
    const referral = await ReferralRepository.readOneByCode(referralCode);
    if (!referral) {
        throw new Error("Invalid referral code");
    }

    /// Create a referral entry linking the new user to the referrer
    const newReferral = await ReferralRepository.create({
        referralCodeId: referral.id,
        referrerId: referral.userId,
        refereeId: userId,
        source: 'LINK'
    });

    if (!newReferral) {
        throw new Error("Failed to process referral");
    }

    return newReferral;
}