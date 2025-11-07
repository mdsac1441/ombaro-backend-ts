import { Elysia } from 'elysia'
import { loadConfig } from '../../../libs'
import { readOne } from './readOne'
import { readList } from './readList'

const config = await loadConfig('referral')

const  xReferralHandlers = new Elysia(
    {
        prefix: '/referral',
        tags: [`${!config.service.enabled?"Referral Module":"Referral"}`],
    }
)
.use(readOne)
.use(readList)

export default xReferralHandlers 
