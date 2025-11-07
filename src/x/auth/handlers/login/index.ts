import { Elysia } from 'elysia'
import { withEmail } from './email'
import { withGoogle } from './google'



const xLogin = new Elysia(
    {
        prefix: '/login',
    }
)
.use(withEmail)
.use(withGoogle)

export default xLogin