import { pgEnum } from "drizzle-orm/pg-core";

export const authProvidersEnum = pgEnum("provider", [
    "GOOGLE",
    "APPLE"
])

export const authDeviceTypeEnum = pgEnum("device_type", [
  "MOBILE",
  "DESKTOP",
  "TABLET",
  "WEB"
])

export const sessionStatusEnum = pgEnum("session_status", [
    "ACTIVE", 
    "EXPIRED", 
    "REVOKED", 
    "SUSPECIOUS"
])

export const authAuditActionEnum = pgEnum("action", [
  "LOGIN", "LOGOUT", "PASSWORD_CHANGE", 
  "MFA_ENABLE", "MFA_DISABLE",
  "MFA_CHALLENGE_SENT", "MFA_VERIFICATION_SUCCESS", "MFA_VERIFICATION_FAILED",
  "EMAIL_VERIFY", "PHONE_VERIFY", "DEVICE_TRUST", 
  "ACCOUNT_LOCK", "ACCOUNT_UNLOCK", "SUSPICIOUS_ACTIVITY",
  "PASSWORD_RESET", "SECURITY_SETTING_CHANGE", 
  "PROVIDER_LINK", "PROVIDER_UNLINK",
  "WEB_AUTHN_REGISTER", "WEB_AUTHN_LOGIN",
]);


export const mfaTypeEnum = pgEnum("mfa_type", [
    "APP",   /// Google Authenticator / Authy (TOTP)
    "EMAIL", /// Email OTP
    "SMS",   /// SMS OTP
    "U2F"    /// Hardware security key (WebAuthn)
])

export const mfaSecurityActionEnum = pgEnum("mfa_action", [
  "LOGIN", 
  "WITHDRAW", 
  "PASSWORD_CHANGE", 
  "API_KEY_CREATE", 
  "SECURITY_SETTINGS_CHANGE",
  "ACCOUNT_RECOVERY"
])
export enum TokenType {
  VERIFICATION = 'VERIFICATION',
  RESET = 'RESET'
}
