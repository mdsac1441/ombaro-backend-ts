import Elysia from 'elysia'
import bearer from "@elysiajs/bearer"
import { jwtVerify, SignJWT } from "jose"
import { loadAndConvertKeyPair } from "../../libs"
import { randomUUIDv7 } from "bun"


const JWT_EXPIRY = Bun.env.JWT_EXPIRY! || process.env.JWT_EXPIRY! || '5m'

export const issuerKey = 'Ombaro Platform'

export const accessToken = new Elysia()
    .use(bearer())
    .decorate('accessJwt', {
        verify: async (token: string) => {
            if (!token) return false
            try {
                const { pubKey } = loadAndConvertKeyPair()
                const { payload } = await jwtVerify(token, pubKey)
                return payload
            } catch (error) {
                return false
            }
        }
    })


export const generateAccessToken = async (data: any) => {
    const { privateKey } = loadAndConvertKeyPair()
    const payload = {
        sub: data,
        iss: issuerKey,
        jti: randomUUIDv7()
    }
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuedAt()
        .setExpirationTime(JWT_EXPIRY)
        .sign(privateKey)
}