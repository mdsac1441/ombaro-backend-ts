import Elysia from 'elysia'
import bearer from "@elysiajs/bearer"
import { jwtVerify, SignJWT } from "jose"
import { loadAndConvertKeyPair, parseTimeString } from "../../libs"
import { randomUUIDv7 } from "bun"
import { issuerKey } from './accessToken'
import { TokenType } from '../../databases/postgres/schema'
import { addOneTimeToken } from '../../x/auth/repositories/addOneTimeToken'


const JWT_RESET_EXPIRY = Bun.env.JWT_RESET_EXPIRY! || process.env.JWT_RESET_EXPIRY! || '5m'

export const resetToken = new Elysia()
    .use(bearer())
    .decorate('resetJwt', {
        verify: async (token: string) => {
            if (!token) return false
            try {
                const { pubKey } = loadAndConvertKeyPair('Reset')
                const { payload } = await jwtVerify(token, pubKey)
                return payload
            } catch (error) {
                return false
            }
        }
    })

export const generateResetToken = async (data: any) => {
    const { privateKey } = loadAndConvertKeyPair('Reset')
   const jti = randomUUIDv7()
    const payload = {
        sub: data,
        iss: issuerKey,
        jti: jti
    }
    await addOneTimeToken(
            jti,
            parseTimeString(JWT_RESET_EXPIRY),
            TokenType.RESET
    )
    return new SignJWT(payload)
        .setProtectedHeader({ alg: 'EdDSA' })
        .setIssuedAt()
        .setExpirationTime(JWT_RESET_EXPIRY)
        .sign(privateKey)
}