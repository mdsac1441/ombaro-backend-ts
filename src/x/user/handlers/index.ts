import { Elysia } from 'elysia'
import { loadConfig } from '../../../libs'
import xProfile from './profile'

const config = await loadConfig('user')

const  xUserHandlers = new Elysia(
    {
        prefix: '/user',
        tags: [`${!config.service.enabled?"User Module":"User"}`],
    }
)
.use(xProfile)

export default xUserHandlers 
