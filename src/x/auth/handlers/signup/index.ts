import { Elysia } from 'elysia'
import { withEmail } from './email'
import { withGoogle } from './google'



const xSignup = new Elysia(
    {
        prefix: '/signup',
    }
)
.use(withEmail)
.use(withGoogle)

export default xSignup