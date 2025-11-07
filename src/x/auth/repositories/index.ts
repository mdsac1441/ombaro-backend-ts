import { DBClient, auths, mfaMethods, users } from "../../../databases/postgres/schema/index";
import { eq } from "drizzle-orm";

export default class AuthRepository {
    static async create(userData: any) {
        try {
            const [newAuth] = await DBClient.insert(auths).values(userData).returning();
            return newAuth;
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }

    static async readOneByEmail(email: string) {

        try {
            const query = DBClient
                .select()
                .from(auths)
                .where(eq(auths.email, email)
                )
                .limit(1);

            const [auth] = await query;
            return auth;
        } catch (error) {
            throw new Error("Failed to fetch user");
        }
    }

 static async readOneByEmailWithMfa(email: string) {
    try {
        const result = await DBClient
            .select()
            .from(auths)
            .leftJoin(users,eq(auths.id,users.authId))
            .where(eq(auths.email, email))
            .limit(1);

        if (result.length === 0) {
            return null;
        }

        const { auths: auth,users:user } = result[0];
        
        /// Return auth data with mfa method (if exists)
        return {
            ...auth,
            user: user ,
        };
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
}


}