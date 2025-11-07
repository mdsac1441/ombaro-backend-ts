import { eq } from "drizzle-orm";
import { auths, DBClient, users } from "../../../databases/postgres/schema";
import { generateResetToken } from "../../../middlewares/helpers";
import { emailQueueWithRedis } from "../../../databases/redis";



export const resetService = async (email: string) => {
    const [data] = await DBClient
        .select()
        .from(auths)
        .where(eq(auths.email, email))
        .leftJoin(users, eq(users.authId, auths.id))
        .limit(1)

    if (!data.users) {
        throw new Error("No User found");
    }
    const resetToken = await generateResetToken({
        auth: {
            id: data.auths.id
        },
    })


    try {
        await emailQueueWithRedis.add({
            emailData: {
                TO: data.auths.email,
                NICK_NAME: data.users.nickName,
                LAST_LOGIN: data.auths.lastLoginAt,
                TOKEN: resetToken,
            },
            emailType: "PasswordReset",
        });

        return {
            message: "Email with reset instructions sent successfully",
        };
    } catch (error) {
        throw error
    }
}