import { auths, DBClient, users } from "../../../databases/postgres/schema/index";
import { eq, or } from "drizzle-orm";

export default class UserRepository {
    static async create(userData: any) {
        try {
            const [newUser] = await DBClient.insert(users).values(userData).returning();
            return newUser;
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }
static async readOne(id: string, authId?: string) {
    try {
        const query = DBClient
            .select()
            .from(users)
            .leftJoin(auths, eq(auths.id, users.authId)) /// Join auths on users.authId
            .where(
                or(
                    eq(users.id, id),
                    eq(auths.id, authId || '') /// Search by auth ID directly
                )
            )
            .limit(1);

        const [result] = await query;
        return result || null;
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
}


}