
import { Elysia } from 'elysia'
import xUserHandlers from './handlers'

const initUser = new Elysia({ prefix: 'api/v1' })
.use(xUserHandlers)

export default initUser
