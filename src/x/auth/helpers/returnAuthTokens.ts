import { generateTokens } from "../../../middlewares/helpers";


export const returnAuthTokens = async ({ auth, message }: { auth: any, message: string }) => {
    const publicAuth = {
        id: auth.id,
        role: auth.roleId, 
    }
    /// Generate tokens and CSRF token
    const { accessToken, csrfToken, sessionId } = await generateTokens(publicAuth);
    
    return {
        message,
        cookies: {
            accessToken: accessToken,
            sessionId: sessionId,
            csrfToken: csrfToken,
        }
    }
}