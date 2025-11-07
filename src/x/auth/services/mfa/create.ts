import { profileMeService } from "../../../user/services/profle/me";
import { MfaCreate } from "../../types/mfa/create";
import { createMfa } from "../../helpers/createMfa";

export const mfaCreateService = async (payload: MfaCreate, user: string) => {
    const { type, secret } = payload;
    const data = await profileMeService(user)
    if(!data.id) {
        throw new Error("unauthorized");
    }
    return createMfa(user,type,secret)
}
