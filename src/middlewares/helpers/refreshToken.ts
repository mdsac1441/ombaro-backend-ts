import Elysia from 'elysia'
import bearer from "@elysiajs/bearer"
import { jwtVerify, SignJWT } from "jose"
import { loadAndConvertKeyPair } from "../../libs"
import { randomUUIDv7 } from "bun"
import { issuerKey } from './accessToken'


const JWT_REFRESH_EXPIRY = Bun.env.JWT_REFRESH_EXPIRY! || process.env.JWT_REFRESH_EXPIRY! || '11d'

export const refreshToken = new Elysia()
    .use(bearer())
    .decorate('refreshJwt', {
        verify: async (token: string) => {
            if (!token) return false
            try {
                const { pubKey } = loadAndConvertKeyPair('Refresh')
                const { payload } = await jwtVerify(token, pubKey)
                return payload
            } catch (error) {
                return false
            }
        }
    })


export const generateRefreshToken = async (data: any) => {
    const { privateKey } = loadAndConvertKeyPair('Refresh')
    const payload = {
        sub: data,
        iss: issuerKey,
        jti: randomUUIDv7()
    }
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuedAt()
        .setExpirationTime(JWT_REFRESH_EXPIRY)
        .sign(privateKey)
}