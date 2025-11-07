import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import { auths, DBClient, oneTimeToken, TokenType } from "../../../../databases/postgres/schema";
import { eq, gt, and } from "drizzle-orm";



export const verifyWithEmailService = async (tokenPayload: any, tokenType: TokenType) => {
    const { jti, sub } = tokenPayload;

    const [dbToken] = await DBClient.select().from(oneTimeToken).where(
        and(
            eq(oneTimeToken.tokenId, jti),
            eq(oneTimeToken.tokenType, TokenType.VERIFICATION),
            gt(oneTimeToken.expiresAt, new Date())
        ))

    if (!dbToken) {
        throw new Error("Invalid or expired token")
    }

    await DBClient.delete(oneTimeToken).where(eq(oneTimeToken.id, dbToken.id));

    const [auth] = await DBClient.update(auths)
        .set({ isEmailVerified: true, emailVerifiedAt: new Date() })
        .where(eq(auths.id, sub.auth.id))
        .returning()

    if (!auth) {
        throw new Error("User not found or email verification failed");
    }
    return returnAuthTokens({
        auth: auth,
        message: "Email verified successfully"
    });

}