import { Elysia } from 'elysia'
import { verifyEmail } from './email'
import { verifyResetEmail } from './reset'



const xLogin = new Elysia(
    {
        prefix: '/verify',
    }
)
.use(verifyEmail)
.use(verifyResetEmail)

export default xLogin