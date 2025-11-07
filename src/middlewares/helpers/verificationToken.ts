import Elysia from 'elysia'
import bearer from "@elysiajs/bearer"
import { jwtVerify, SignJWT } from "jose"
import { loadAndConvertKeyPair, parseTimeString } from "../../libs"
import { randomUUIDv7 } from "bun"
import { issuerKey } from './accessToken'
import { addOneTimeToken } from '../../x/auth/repositories/addOneTimeToken'
import { TokenType } from '../../databases/postgres/schema'


const JWT_VERIFICATION_EXPIRY = Bun.env.JWT_VERIFICATION_EXPIRY! || process.env.JWT_VERIFICATION_EXPIRY! || '5m'

export const verificationToken = new Elysia()
    .use(bearer())
    .decorate('verificationJwt', {
        verify: async (token: string) => {
            if (!token) return false
            try {
                const { pubKey } = loadAndConvertKeyPair('Verification')
                const { payload } = await jwtVerify(token, pubKey)
                return payload
            } catch (error) {
                return false
            }
        }
    })

export const generateVerificationToken = async (data: any) => {
    const { privateKey } = loadAndConvertKeyPair('Verification')
    const jti = randomUUIDv7()
    const payload = {
        sub: data,
        iss: issuerKey,
        jti: jti
    }
    await addOneTimeToken(
            jti,
            parseTimeString(JWT_VERIFICATION_EXPIRY),
            TokenType.VERIFICATION
        )
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuedAt()
        .setExpirationTime(JWT_VERIFICATION_EXPIRY)
        .sign(privateKey)
}