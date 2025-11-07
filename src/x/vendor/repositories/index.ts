import { DBClient, referralCodes,referrals } from "../../../databases/postgres/schema/index";
import { eq } from "drizzle-orm";

export default class VendorRepository {
    static async create(data: any) {
        try {
            /// TODO: Implement vendor creation
        } catch (error) {
            throw new Error("Failed to create referral");
        }
    }

}