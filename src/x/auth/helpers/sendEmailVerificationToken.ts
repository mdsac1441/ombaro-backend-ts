import { eq } from "drizzle-orm";
import { auths, DBClient } from "../../../databases/postgres/schema";
import { generateVerificationToken } from "../../../middlewares/helpers";
import { emailQueueWithRedis } from "../../../databases/redis";
import { profileMeService } from "../../user/services/profle/me";


export const sendEmailVerificationToken = async (
    authId: any,
    email: string
) => {
    const user = await profileMeService(authId)
    if (!user) {
        throw new Error("User not found")
    }

    const token = await generateVerificationToken({
        auth: {
            id: authId,
        },
    });

    try {
         await emailQueueWithRedis.add({
            emailData: {
                TO: email,
                NICK_NAME: user.nickName,
                CREATED_AT: user.createdAt,
                TOKEN: token,
            },
            emailType: "EmailVerification",
        });
        return {
            message: "Email with verification code sent successfully",
        };
    } catch (error) {
        throw error
    }
};