import { eq, or } from "drizzle-orm"
import { DBClient, mfaMethods } from "../../../../databases/postgres/schema"

export const mfaReadListService = async (id: string) => {
    return await  DBClient.select()
    .from(mfaMethods)
    .where(or(eq(mfaMethods.authId,id)))
    .limit(3)
}