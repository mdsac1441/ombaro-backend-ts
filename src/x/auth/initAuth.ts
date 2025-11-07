
import { Elysia } from 'elysia'
import xAuthHandlers from './handlers'

const initAuth = new Elysia({ prefix: 'api/v1' })
.use(xAuthHandlers)

export default initAuth
