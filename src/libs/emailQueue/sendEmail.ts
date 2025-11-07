import { sendEmailWithProvider } from "../mailer/providers";
import { fetchAndProcessEmailVerification, prepareEmailTemplate } from "../mailer/templates";
import { EmailOptions } from "../mailer/types";

const OMBARO_EMAILER = process.env.OMBARO_EMAILER || "nodemailer-smtp";

export async function sendEmail(
    specificVariables: any,
    templateName: string
): Promise<void> {
    let processedTemplate: string;
    let processedSubject: string;
    console.log(OMBARO_EMAILER);
    

    try {
        const result = await fetchAndProcessEmailVerification(
            {
                TOKEN: specificVariables.TOKEN,
                EMAIL_TYPE:  templateName,
                NICK_NAME: specificVariables.NICK_NAME,
                CREATED_AT: specificVariables.CREATED_AT,
                LAST_LOGIN: specificVariables.LAST_LOGIN

            }
        );
        processedTemplate = result.processedTemplate;
        processedSubject = result.processedSubject;
    } catch (error) {
        console.error("Error processing email template:", error);
        throw error;
    }

    let finalEmailHtml: string;
    try {
        finalEmailHtml = await prepareEmailTemplate(
            processedTemplate,
            processedSubject
        );
    } catch (error) {
        console.error("Error preparing email template:", error);
        throw error;
    }

    const options: EmailOptions = {
        to: specificVariables["TO"] as string,
        subject: processedSubject,
        html: finalEmailHtml,
    };
    const emailer = OMBARO_EMAILER;
    try {
        await sendEmailWithProvider(emailer, options);
    } catch (error) {
        console.error("Error sending email with provider:", error);
        throw error;
    }
}
