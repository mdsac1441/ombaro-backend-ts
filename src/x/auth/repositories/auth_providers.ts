import { and, eq } from "drizzle-orm";
import { authProviders, DBClient } from "../../../databases/postgres/schema";

 
 type Provider = 'GOOGLE' | 'APPLE'
 
 export const readOne= async (providerSocialId: string,provider: Provider ) => {
    try {
        const [result] = await DBClient
            .select()
            .from(authProviders)
            .where(
                and(
                    eq(authProviders.providerSocialId, providerSocialId),
                    eq(authProviders.provider,provider)
                )
            )
            .limit(1);
        return  result
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
}

 export const create = async (data: any) => {
    try {
        const [result] = await DBClient
        .insert(authProviders)
        .values(data)
        .returning()
        return  result
    } catch (error) {
        throw new Error("Failed to fetch user");
    }
}