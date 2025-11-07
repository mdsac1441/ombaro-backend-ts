import { emailQueueWithRedis } from "../../databases/redis";
import { sendEmail } from "./sendEmail";


emailQueueWithRedis.process(async (job) => {
  const { emailData, emailType } = job.data;

  try {
    await sendEmail(emailData, emailType);
    console.log("Email sent successfully");
  } catch (error) {
    console.error("Failed to send email:", error);
    // Optionally: Re-queue or handle the job based on the error
    throw error;
  }
});