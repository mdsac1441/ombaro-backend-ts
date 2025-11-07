import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import AuthRepository from "../../repositories";
import { SignupWithGoogle } from "../../types";
import { google, handleReferralForSignup } from "../../helpers";
import { create, readOne } from "../../repositories/auth_providers";
import { generateRandomNickname, generateReferralCode, generateUID } from "../../../../libs";
import UserRepository from "../../../user/repositories";
import ReferralRepository from "../../../referral/repositories";
import { DBClient, roles, userRoles } from "../../../../databases/postgres/schema";
import { eq } from "drizzle-orm";


export const signupWithGoogleService = async (userData: SignupWithGoogle) => {
    let { token, referralCode } = userData;

    const payload = await google(token)
    if (!payload) {
        throw new Error("Invalid Google token");
    }

    const {
        sub: providerSocialId,
        email,
        given_name: nickName,
        name,
        picture
    } = payload;

    if (!providerSocialId || !email || !nickName) {
        throw new Error("Incomplete user information from Google");
    }

    let auths = await AuthRepository.readOneByEmail(email);

    let isNewAuth = false;

    let userId;

    if (auths && auths.email) {

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

    } else {
        const newAuth = await AuthRepository.create(
            {
                email: email,
                isEmailVerified: true,
                emailVerifiedAt: new Date(),
                consentAt: new Date()
            }
        );

        const newUser = await UserRepository.create({
            uid: generateUID(newAuth.id),
            authId: newAuth.id,
            nickName: nickName,
            marketingConsent: true,
            acceptedTermsAt: new Date(),
            acceptedPrivacyAt: new Date()
        })
        if (!newUser) throw new Error('Signup failed, please try again later.');
        /// generate referral code and save it.
        const code = generateReferralCode(newUser.id);
        const newReferralCode = await ReferralRepository.createCode({ userId: newUser.id, code: code })

        if (!newReferralCode) throw new Error('Signup failed, please try again later.');
        try {
            if (referralCode) await handleReferralForSignup(referralCode, newUser.id);
        } catch (error) {
            console.error("Error handling referral signup:", error);
        }
        isNewAuth = true
        auths = newAuth;
        userId = newUser.id
    }

    const [role] = await DBClient.select().from(roles).where(eq(roles.name, "user")).limit(1)

    if (!role) throw new Error('Signup failed: due Role not found')

    const [userRole] = await DBClient.insert(userRoles).values({
        userId: userId as string,
        roleId: role.id,
        isPrimary: true
    }).returning()
    
    if (!userRole) throw new Error('Signup failed: could not assign user role')

    return returnAuthTokens({
        auth: {
            id: auths.id,
            role: userRole.id
        },
        message: isNewAuth
            ? "You have been registered successfully"
            : "You have been logged in successfully",
    })

}