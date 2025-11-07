import { profileMeService } from "../../../user/services/profle/me";
import { authenticator } from "otplib";
import { MfaLogin } from "../../types/mfa/login";
import { returnAuthTokens } from "../../helpers";
import { verifyOTP } from "../../../../libs/otp";
import { mfaReadOneService } from "./readOne";

export const mfaLoginService = async (payload: MfaLogin) => {
    const { otp, authId, type } = payload;
    const data = await profileMeService(authId)
    if (!data.id) {
        throw new Error("unauthorized");
    }
    let isValid
    switch (type) {
        case "APP":
            const mfaData = await mfaReadOneService("APP")
            if (!mfaData.secret) throw new Error("Secret required for APP verification");
            isValid = authenticator.verify({ token: otp, secret: mfaData.secret });
            break;

        case "SMS":
            isValid = await verifyOTP(data.id, otp, 'SMS');
            break;

        case "EMAIL":
            isValid = await verifyOTP(data.id, otp, 'EMAIL');
            break;

        default:
            throw new Error("Invalid MFA type");
    }

    if (!isValid) {
        throw new Error("Invalid OTP");
    }
    return returnAuthTokens({
        auth: {id: authId},
        message: "You have been logged in successfully with 2FA",
    });
}
