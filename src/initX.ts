import Elysia from 'elysia'
import xAuthAdapter from './x/auth/adapter'
import xUserAdapter from './x/user/adpater'
import xKycAdapter from './x/kyc/adapter'
import xReferralAdapter from './x/referral/adapter'


const initX = new Elysia({ prefix: 'api/v1' })
    .get("/ping", () => {
        return {}
    }, {
        tags: ["Ping"],
        detail: {
            description: "Ping the server to check if it's running",
        }

    })
    .get("/time", () => {
        return { serverTime: Date.now() }
    }, {
        tags: ["Time"],
        description: "Get the current server time"
    })
    .use(xAuthAdapter)
    .use(xUserAdapter)
    .use(xKycAdapter)
    .use(xReferralAdapter)

export default initX