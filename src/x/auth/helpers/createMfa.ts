import { eq } from "drizzle-orm";
import { DBClient, mfaMethods, users } from "../../../databases/postgres/schema";

export const createMfa = async (
    authId: string,
    type: "EMAIL" | "SMS" | "APP" | "U2F",
    secret?: string,
) => {
    if (!type) throw new Error("Missing required parameters");

    if (type === "APP" && !secret) {
        throw new Error("APP MFA requires a secret");
    }

    let mfaDetails;
    const commonData = {
        type,
        isEnabled: true,
        enabledAt: new Date()
    };
    /// Only include secret for APP type, null for others
    const mfaData = type === "APP"
        ? { ...commonData, secret }
        : { ...commonData, secret: null };

    const [existingTwoFactor] = await DBClient
        .select().
        from(mfaMethods)
        .where(eq(mfaMethods.authId, authId))

    if (existingTwoFactor) {
        /// Update existing 2FA record
        [mfaDetails] = await DBClient
            .update(mfaMethods)
            .set(mfaData)
            .where(eq(mfaMethods.id, existingTwoFactor.id))
            .returning()
    } else {
        /// Create new 2FA record
        [mfaDetails] = await DBClient
            .insert(mfaMethods)
            .values({
               authId,
                ...mfaData
            })
            .returning()
    }

    return mfaDetails;
}