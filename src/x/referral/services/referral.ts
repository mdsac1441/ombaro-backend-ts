import { count, eq, or } from "drizzle-orm"
import { DBClient, referralCodes, referrals, users } from "../../../databases/postgres/schema"

export const referralReadOneService = async (userId: string) => {
    try {
        const [referral] = await DBClient.select({
            id: referralCodes.id,
            code: referralCodes.code,
            campaignId: referralCodes.campaignId,
            status: referrals.status,
            source: referrals.source,
            active: referralCodes.isActive,
            count: count(referrals.id),
        })
        .from(users)
        .leftJoin(referralCodes, eq(referralCodes.userId, users.id))
        .leftJoin(referrals, eq(referrals.referralCodeId, referralCodes.id))
        .where(or(eq(users.id, userId), eq(users.authId, userId)))
        .groupBy(referralCodes.id, referrals.status, referrals.source, referralCodes.isActive)
        .limit(1)
        
        return referral
    } catch (error) {
        console.error("Error fetching referral data:", error)
        throw new Error("Failed to fetch referral information")
    }
}


export const referralReadListService = async (referralCodeId: string) => {
    try {
        const referralList = await DBClient.select({
            id: referrals.id,
            referrer: referrals.referrerId,
            referee: referrals.refereeId,
            status: referrals.status,
            source: referrals.source,
            level: referrals.level,
            createdAt: referrals.createdAt,
            user: {
                uid: users.uid,
                nickName: users.nickName,
            }
        })
        .from(referrals)
        .leftJoin(users, eq(referrals.refereeId, users.id))
        .where(eq(referrals.referralCodeId, referralCodeId))
        .orderBy(referrals.createdAt)
        .limit(50) // Increased limit to get more results

        return referralList
    } catch (error) {
        console.error("Error fetching referral data:", error)
        throw new Error("Failed to fetch referral information")
    }
}