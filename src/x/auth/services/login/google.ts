import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import AuthRepository from "../../repositories";
import { LoginWithGoogle } from "../../types";
import { google } from "../../helpers";
import { create, readOne } from "../../repositories/auth_providers";


export const loginWithGoogleService = async (userData: LoginWithGoogle) => {
    let { token } = userData;

    const payload = await google(token)
    if (!payload) {
        throw new Error("Invalid Google token");
    }

    const {
        sub: providerSocialId,
        email,
        name,
        picture
    } = payload;

    if (!providerSocialId || !email) {
        throw new Error("Incomplete user information from Google");
    }

    const auths = await AuthRepository.readOneByEmail(email);

    if (!auths) {
        throw new Error("User not found");
    }

    const provider = await readOne(providerSocialId, 'GOOGLE')

    if (!provider) {
        await create({
            authId: auths.id,
            provider: 'GOOGLE',
            providerSocialId: providerSocialId,
            email: email,
            name: name,
            avatar: picture
        })
    }

    return returnAuthTokens({
        auth: auths,
        message: "You have been logged in successfully",
    });

}