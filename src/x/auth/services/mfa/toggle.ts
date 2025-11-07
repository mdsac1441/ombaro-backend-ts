import { eq } from "drizzle-orm"
import { DBClient, mfaMethods } from "../../../../databases/postgres/schema"


export const mfaToggleService = async (authId: any, isEnable: boolean) => {
    const [data] = await DBClient.update(mfaMethods)
        .set({ isEnabled: isEnable })
        .where(eq(mfaMethods.authId, authId))
        .returning(
            {
                id: mfaMethods.id,
                isEnabled: mfaMethods.isEnabled
            }
        )
    return data
}