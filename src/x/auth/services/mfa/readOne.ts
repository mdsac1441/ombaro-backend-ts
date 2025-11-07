import { eq, or } from "drizzle-orm"
import { auths, DBClient, mfaMethods, users } from "../../../../databases/postgres/schema"
import { password, secrets } from "bun";
import { status } from "elysia";


export const mfaReadOneService = async (type: 'SMS' | 'EMAIL' | 'APP' ) => {
    
    const [mfa] = await  DBClient.select({
        id: mfaMethods.id,
        authId: mfaMethods.authId,
        isEnabled: mfaMethods.isEnabled,
        isPrimary: mfaMethods.isPrimary,
        enabledAt: mfaMethods.enabledAt,
        lastUsedAt: mfaMethods.lastUsedAt,
        secret: mfaMethods.secret
    })
    .from(mfaMethods)
    .where(eq(mfaMethods.type,type))
    .limit(1)
    return mfa
}