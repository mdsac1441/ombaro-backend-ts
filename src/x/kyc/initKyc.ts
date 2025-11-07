
import { Elysia } from 'elysia'
import xKycHandlers from './handlers'

const initKyc = new Elysia({ prefix: 'api/v1' })
.use(xKycHandlers)

export default initKyc
