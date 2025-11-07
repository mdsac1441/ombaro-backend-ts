import { OMBARO_NODEMAILER_FROM, OMBARO_NODEMAILER_REPLY_TO, OMBARO_NODEMAILER_SMTP_ENCRYPTION, OMBARO_NODEMAILER_SMTP_HOST, OMBARO_NODEMAILER_SMTP_PASSWORD, OMBARO_NODEMAILER_SMTP_PORT, OMBARO_NODEMAILER_SMTP_SENDER, OMBARO_SENDGRID_SENDER } from "../constant";
import { EmailOptions } from "../types";
import { emailWithSendgrid } from "./sendgrid";
import { emailWithNodemailerSmtp } from "./smtp";

export async function sendEmailWithProvider(
  provider: string,
  options: EmailOptions
) {
  try {
    switch (provider) {
      case "nodemailer-smtp":
        options.from = OMBARO_NODEMAILER_FROM;
        options.replyTo = OMBARO_NODEMAILER_REPLY_TO
        await emailWithNodemailerSmtp(
          OMBARO_NODEMAILER_SMTP_SENDER,
          OMBARO_NODEMAILER_SMTP_PASSWORD,
          OMBARO_NODEMAILER_SMTP_HOST,
          OMBARO_NODEMAILER_SMTP_PORT,
          OMBARO_NODEMAILER_SMTP_ENCRYPTION === "ssl",
          options
        );
        break;

      case "nodemailer-sendgrid":
        options.from = OMBARO_SENDGRID_SENDER;
        await emailWithSendgrid(options);
        break;

      default:
        throw new Error("Unsupported email provider");
    }
  } catch (error) {
    console.log("email", error, __filename);
    throw error;
  }
}