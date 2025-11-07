import { redisWithLocalCacheSupport } from "../../databases/redis";
import { generateAccessToken } from "./accessToken";
import { generateCsrfToken } from "./csrfToken";
import { generateRefreshToken } from "./refreshToken";
import { generateAuthSessionKey, generateSessionId } from "./sessionIdAndKey";

export const generateTokens = async (data: any) => {
    const accessToken = generateAccessToken(data);
    const refreshToken = generateRefreshToken(data);
    const csrfToken = generateCsrfToken();
    const sessionId = generateSessionId();
    const userSessionKey = generateAuthSessionKey(sessionId)

    const authData = {
        data,
        sessionId,
        csrfToken,
        refreshToken
    }

    //  await redisWithLocalCacheSupport.set(userSessionKey, JSON.stringify(authData), 60 * 60 * 24 * 11);

    return { accessToken, refreshToken, csrfToken, sessionId }
}   