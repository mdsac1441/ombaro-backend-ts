import { DBClient, referralCodes,referrals } from "../../../databases/postgres/schema/index";
import { eq } from "drizzle-orm";

export default class ReferralRepository {
    static async createCode(data: any) {
        try {
            const [newReferralCode] = await DBClient.insert(referralCodes).values(data).returning();
            return newReferralCode;
        } catch (error) {
            throw new Error("Failed to create user");
        }
    }

    static async create(data: any) {
        try {
            const [newReferral] = await DBClient.insert(referrals).values(data).returning();
            return newReferral;
        } catch (error) {
            throw new Error("Failed to create referral");
        }
    }

    static async readOneByCode(code: string) {

        try {
            const query = DBClient
                .select()
                .from(referralCodes)
                .where(eq(referralCodes.code, code)
                )
                .limit(1);

            const [refrral] = await query;
            return refrral || null;
        } catch (error) {
            throw new Error("Failed to fetch user");
        }
    }


}