import { eq, or } from "drizzle-orm"
import { auths, DBClient, mfaMethods, users } from "../../../../databases/postgres/schema"
import { password } from "bun";
import { status } from "elysia";


export const profileMeService = async (id: string) => {
    
    const [user] = await  DBClient.select({
        id: users.id,
        uid: users.uid,
        nickName: users.nickName,
        status: users.status,
        createdAt: users.createdAt,
        auth: {
            id: auths.id,
            email: auths.email,
            isEmailVerified: auths.isEmailVerified,
            isPhoneVerified: auths.isPhoneVerified,
            lastLoginAt :auths.lastLoginAt
        }
    })
    .from(users)
    .leftJoin(auths, eq(auths.id, users.authId))
    .leftJoin(mfaMethods,eq(mfaMethods.authId,auths.id))
    .where(or(eq(users.id,id),eq(users.authId,id)))
    .limit(1)
    return user
}