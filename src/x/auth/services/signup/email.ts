// import  UserRepository  from "../../repositories"
import { eq } from "drizzle-orm";
import { DBClient, roles, userRoles } from "../../../../databases/postgres/schema";
import { generateOTP, hashPassword, generateReferralCode, generateRandomNickname, validatePassword, generateUID } from "../../../../libs"
import ReferralRepository from "../../../referral/repositories";
import UserRepository from "../../../user/repositories";
import { handleReferralForSignup, sendEmailVerificationToken } from "../../helpers";
import { returnAuthTokens } from "../../helpers/returnAuthTokens";
import AuthRepository from "../../repositories";
import { SignupWithEmail } from "../../types/signup";



export const signupWithEmailService = async (userData: SignupWithEmail) => {
    let { email, password, referralCode, consent } = userData;

    email = email?.trim().toLowerCase();
    if (!email) {
        throw new Error("Email is required.");
    }

    if (!validatePassword(password)) {
        throw new Error("Invalid password format");
    }

    const auth = await AuthRepository.readOneByEmail(email);
    if (auth && auth.email) {
        if (
            !auth.isEmailVerified &&
            process.env.OMBARO_VERIFY_EMAIL_STATUS === "true"
        ) {
            await sendEmailVerificationToken(auth.id, auth.email);
            return {
                message: "User already registered but email not verified. Verification email sent.",
                cookies: undefined
            };
        }
        throw new Error("Email already in use");
    }
    /// Hash the password before storing
    const hashedPassword = await hashPassword(password);


    /// Create the user in database
    const newAuth = await AuthRepository.create({ ...userData, consentAt: new Date(), password: hashedPassword });
    if (!newAuth) throw new Error('Signup failed, please try again later.')

    const nickname = generateRandomNickname();

    const newUser = await UserRepository.create({
        uid: generateUID(newAuth.id),
        authId: newAuth.id,
        nickName: nickname,
        marketingConsent: consent,
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

    const [role] = await DBClient.select().from(roles).where(eq(roles.name, "user")).limit(1)

    if (!role) throw new Error('Signup failed: due Role not found')
        
    const [userRole] = await DBClient.insert(userRoles).values({
        userId: newUser.id,
        roleId: role.id,
        isPrimary: true
    }).returning()

    if (!userRole) throw new Error('Signup failed: could not assign user role')

    if (process.env.OMBARO_VERIFY_EMAIL_STATUS === "true") {
        await sendEmailVerificationToken(newAuth.id, newAuth.email);
        return {
            message: "Registration successful, please verify your email",
            cookies: undefined
        };
    } else {
        return returnAuthTokens({
            auth: {
                id: newAuth.id,
                role: userRole.roleId
            },
            message: "You have been registered successfully",
        });
    }
}