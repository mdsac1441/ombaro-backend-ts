import { profileMeService } from "../../../user/services/profle/me";
import { MfaVerify } from "../../types/mfa/verify";
import { createMfa } from "../../helpers/createMfa";
import { authenticator } from "otplib";
import { verifyOTP } from "../../../../libs/otp";

export const mfaVerifyService = async (payload: MfaVerify, user: string) => {
    const { otp, secret, type } = payload;
    const data = await profileMeService(user)
    if (!data.id) {
        throw new Error("unauthorized");
    }
    let isValid
    switch (type) {
        case "APP":
            if (!secret) throw new Error("Secret required for APP verification");
            isValid = authenticator.verify({ token: otp,secret: secret });
            break;

        case "SMS":
            isValid = await verifyOTP(data.id, otp,'SMS');
            break;

        case "EMAIL":
            isValid = await verifyOTP(data.id, otp,'EMAIL');
            break;

        default:
            throw new Error("Invalid MFA type");
    }

    if (!isValid) {
        throw new Error("Invalid OTP");
    }
    return createMfa(user, type, secret)
}
