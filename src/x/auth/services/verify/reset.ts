import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import { auths, DBClient, oneTimeToken, TokenType } from "../../../../databases/postgres/schema";
import { eq, gt, and } from "drizzle-orm";
import { hashPassword } from "../../../../libs";



export const verifyWithResetlService = async (tokenPayload: any, newPassword: string) => {
    const { jti, sub } = tokenPayload;

    const [dbToken] = await DBClient.select().from(oneTimeToken).where(
        and(
            eq(oneTimeToken.tokenId, jti),
            eq(oneTimeToken.tokenType, TokenType.RESET),
            gt(oneTimeToken.expiresAt, new Date())
        ))

    if (!dbToken) {
        throw new Error("Invalid or expired token")
    }

    await DBClient.delete(oneTimeToken).where(eq(oneTimeToken.id, dbToken.id));

    const hashedPassword = await hashPassword(newPassword);

    const [auth] = await DBClient.update(auths)
        .set({ password: hashedPassword, passwordChangedAt: new Date() })
        .where(eq(auths.id, sub.auth.id))
        .returning()

    if (!auth) {
        throw new Error("User not found or password update failed");
    }

    return returnAuthTokens({
        auth: auth,
        message: "Password reset successfully",
    });

}