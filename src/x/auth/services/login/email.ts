import { generateOTP, verifyPassword } from "../../../../libs"
import { verifyRecaptcha } from "../../helpers";
import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import AuthRepository from "../../repositories";
import { LoginWithEmail } from "../../types//login/email";
import { sendEmailVerificationToken } from "../../helpers/sendEmailVerificationToken";
import { OMBARO_2FA_SMS_STATUS, OMBARO_2FA_STATUS, OMBARO_TWILIO_VERIFY_SERVICE_SID, } from "../../../shared/constant";
import { emailQueueWithRedis } from "../../../../databases/redis";
import { mfaReadListService } from "../mfa/readList";
import { storeOTPWithSecurity } from "../../../../libs/otp";


const recaptchaEnabled = process.env.OMBARO_GOOGLE_RECAPTCHA_STATUS === "true" || false;

export const loginWithEmailService = async (userData: LoginWithEmail) => {
  let { email, password, recaptcha } = userData;

  email = email.trim().toLowerCase();

  if (recaptchaEnabled) {
    if (!recaptcha) throw new Error("Missing reCAPTCHA token");
    const isHuman = await verifyRecaptcha(recaptcha);
    if (!isHuman) {
      throw new Error("reCAPTCHA verification failed. Please try again.");
    }
  }

  const auths = await AuthRepository.readOneByEmailWithMfa(email);

  if (!auths || !auths.password || !auths.user) {
    throw new Error("Incorrect email or password");
  }


  if (
    !auths.isEmailVerified &&
    process.env.OMBARO_VERIFY_EMAIL_STATUS === "true" &&
    auths.email
  ) {
    await sendEmailVerificationToken(auths.id, auths.email);
    return {
      message: "User email not verified. Verification email sent.",
      cookies: undefined
    }
  }

  const isPasswordValid = await verifyPassword(password, auths.password);
  if (!isPasswordValid) {
    /// TO-DO: Implement account lockout mechanism after multiple failed attempts
    throw new Error("Incorrect email or password");
  }

  const mfa = await mfaReadListService(auths.id)
  const enabledMfas = mfa.filter(m => m.isEnabled) || [];

  /// TO-DO: blockedUntil check for account lockout mechanism


  /// TO-DO: MFA check

  if (enabledMfas.length === 0 || OMBARO_2FA_STATUS !== "true") {
    /// Normal login (without mfa)
    return returnAuthTokens({
      auth: auths,
      message: "You have been logged in successfully",
    });
  }

  if (enabledMfas.length > 1) {
    /// Ask user to pick MFA
    return {
      twoFactor: {
        enabled: true,
        methods: enabledMfas.map(m => m.type)
      },
      authId: auths.id,
      message: "Choose MFA method"
    };
  }
  const mfaOne = enabledMfas[0];
  try {
    if (
      mfaOne.type === "SMS" &&
      OMBARO_2FA_SMS_STATUS === "true" &&
      OMBARO_TWILIO_VERIFY_SERVICE_SID
    ) {
      /// TO-DO: Integrate SMS service like Twilio to send OTP
      return {
        twoFactor: { enabled: true, method: "SMS" },
        authId: auths.id,
        message: "OTP sent via SMS"
      };
    } else if (
      mfaOne.type === "EMAIL" &&
      process.env.OMBARO_2FA_EMAIL_STATUS === "true"
    ) {
      const otp = generateOTP()
      await storeOTPWithSecurity(auths.user.id, otp, "EMAIL")
      await emailQueueWithRedis.add({
        emailData: {
          TO: auths.email,
          NICK_NAME: auths.user.nickName,
          TOKEN: otp,
        },
        emailType: "OTPTokenVerification",
      });
      return {
        twoFactor: { enabled: true, method: "EMAIL" },
        authId: auths.id,
        message: "OTP sent via Email"
      };

    } else if (
      mfaOne.type === "APP" &&
      process.env.OMBARO_2FA_APP_STATUS === "true"
    ) {
      /// Do nothing here → expect frontend to send code for verification
      return {
        twoFactor: { enabled: true, method: "APP" },
        authId: auths.id,
        message: "Enter OTP from authenticator app",
      }
    } else {
      throw new Error("Invalid 2FA type")
    }

  } catch (error) {
    if (error instanceof Error) {
      throw error
    }
    throw new Error(String(error))
  }

}