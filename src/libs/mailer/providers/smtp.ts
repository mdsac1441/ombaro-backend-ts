import { EmailOptions } from "../types";
import nodemailer from "nodemailer";

export const emailWithNodemailerSmtp = async (
  sender: string,
  password: string,
  host: string,
  port: string,
  smtpEncryption: boolean,
  options: EmailOptions
): Promise<void> => {
  const emailOptions = {
    from: options.from,
    to: options.to,
    subject: options.subject,
    html: options.html,
  };

  if (!host)
    throw new Error("Email host not specified. Aborting email send.");

  if (!sender)
    throw new Error("Email user not specified. Aborting email send.");

  if (!password) 
    throw new Error("Email password not specified. Aborting email send.");

  try {
    const configOptions = {
      host: host,
      port: parseInt(port,10),
      pool: true,
      secure: false,
      auth: {
        user: sender,
        pass: password,
      },
      tls: {
        rejectUnauthorized: false,
      },
    }
    const transporter =  nodemailer.createTransport(configOptions);
    await transporter.verify();
    await transporter.sendMail(emailOptions);
  } catch (error) {
    console.log("email", error, __filename)
    throw error;
  }
}