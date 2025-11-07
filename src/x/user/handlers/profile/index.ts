import { Elysia } from 'elysia'
import { me } from './me'



const xProfile = new Elysia(
    {
        prefix: '/profile',
    }
)
.use(me)

export default xProfile