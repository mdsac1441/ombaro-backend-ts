
export const OMBARO_SITE_URL = process.env.OMBARO_SITE_URL || "https://www.ombaro.com";
export const OMBARO_SITE_NAME = process.env.OMBARO_SITE_NAME || "Ombaro";

export const OMBARO_NODEMAILER_FROM =
    process.env.OMBARO_NODEMAILER_FROM! || "<no-reply@ombaro.com>";

export const OMBARO_NODEMAILER_REPLY_TO =
    process.env.OMBARO_NODEMAILER_REPLY_TO! || "support@ombaro.com";

export const OMBARO_NODEMAILER_SMTP_SENDER =
    process.env.OMBARO_NODEMAILER_SMTP_SENDER! || "";

export const OMBARO_NODEMAILER_SMTP_PASSWORD =
    process.env.OMBARO_NODEMAILER_SMTP_PASSWORD! || "";

export const OMBARO_NODEMAILER_SMTP_HOST =
    process.env.OMBARO_NODEMAILER_SMTP_HOST! || "smtp.gmail.com";

export const OMBARO_NODEMAILER_SMTP_PORT =
    process.env.OMBARO_NODEMAILER_SMTP_PORT! || "587";

export const OMBARO_NODEMAILER_SMTP_ENCRYPTION =
    process.env.OMBARO_NODEMAILER_SMTP_ENCRYPTION! || "tls";

export const OMBARO_SENDGRID_API_KEY = process.env.OMBARO_SENDGRID_API_KEY! || "";

export const OMBARO_SENDGRID_SENDER = process.env.OMBARO_SENDGRID_SENDER! || "";