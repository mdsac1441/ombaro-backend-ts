import { auths, DBClient } from "../../../../databases/postgres/schema";
import { eq } from "drizzle-orm";
import { MfaGenerate } from "../../types/mfa";
import { authenticator } from "otplib";
import QRCode from "qrcode";
import { AppName, OMBARO_2FA_APP_STATUS, OMBARO_2FA_EMAIL_STATUS, OMBARO_2FA_SMS_STATUS, OMBARO_TWILIO_ACCOUNT_SID, OMBARO_TWILIO_AUTH_TOKEN, OMBARO_TWILIO_VERIFY_SERVICE_SID } from "../../../shared/constant";
import { profileMeService } from "../../../user/services/profle/me";
import { emailQueueWithRedis } from "../../../../databases/redis";
import { generateOTP } from "../../../../libs";
import { storeOTPWithSecurity } from "../../../../libs/otp";



export const mfaGenerateService = async (payload: MfaGenerate, user: string) => {
    const { type, phone } = payload;

    const data = await profileMeService(user)
    if (!data.auth || !data.id) {
        throw new Error("No User found");
    }
    if (type === "SMS" && OMBARO_2FA_SMS_STATUS === "true") {

        if (!phone) {
            throw new Error("Phone number is required for SMS")
        }
        try {
            await DBClient.update(auths)
                .set({ phone: phone })
                .where(eq(auths.id, data.auth.id))
        } catch (error) {
            throw error
        }
        const otp = generateOTP()
        await storeOTPWithSecurity(data.id,otp,'SMS')
        if (!process.env.APP_TWILIO_VERIFY_SERVICE_SID) {
            throw new Error("Service SID is not set")
        }
        try {
            const twilio = (await import("twilio")).default;
            const twilioClient = twilio(
                OMBARO_TWILIO_ACCOUNT_SID,
                OMBARO_TWILIO_AUTH_TOKEN
            );
            await twilioClient.verify.v2
                .services(OMBARO_TWILIO_VERIFY_SERVICE_SID)
                .verifications.create({ to: `+${phone}`, channel: "sms" });
        } catch (error) {
            console.log("Error sending SMS OTP", error);
            throw error
        }
        return {
            message: `OTP sent on +${phone}.Please check and verify `
        };
    } else if (
        type === "APP" &&
        OMBARO_2FA_APP_STATUS === "true"
    ) {
        if (!data.auth.email) {
            throw new Error("Email is required for APP OTP");
        }
        const email = data.auth.email;
        const secret = authenticator.generateSecret()
        const otpAuth = authenticator.keyuri(email, AppName, secret);
        const qrcode = await QRCode.toDataURL(otpAuth);
        return { secret, qrcode };
    } else if (
        type === "EMAIL" &&
        OMBARO_2FA_EMAIL_STATUS === "true"
    ) {
        const email = data.auth.email;
        const otp = generateOTP()
        await storeOTPWithSecurity(data.id,otp,'EMAIL')
        try {
            await emailQueueWithRedis.add({
                emailData: {
                    TO: email,
                    NICK_NAME: data.nickName,
                    TOKEN: otp,
                },
                emailType: "OTPTokenVerification",
            });
        } catch (error) {
            throw error
        }
        return {
            message: `OTP sent on ${email}.Please check and verify `
        };
    } else {
        throw new Error("Invalid type or 2FA method not enabled")
    }

}