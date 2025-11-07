import sgMail from "@sendgrid/mail"
import { EmailOptions } from "../types";
import { OMBARO_SENDGRID_API_KEY } from "../constant";



export const emailWithSendgrid = async (options: EmailOptions): Promise<void> => {
  const apiKey = OMBARO_SENDGRID_API_KEY;

  if (!apiKey)
    throw new Error('Sendgrid Api key not found. Cannot send email. Aborting.')

  try {
    sgMail.setApiKey(apiKey);

    const msg: any = {
      to: options.to,
      from: options.from,
      subject: options.subject,
      html: options.html ? options.html : options.text,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.log("email", error, __filename);
    throw error;
  }
}