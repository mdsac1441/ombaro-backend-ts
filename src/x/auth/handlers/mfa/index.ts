import { Elysia } from 'elysia'
import { generate } from './generate'
import { create } from './create'
import { verify } from './verify'




const xMfa = new Elysia(
    {
        prefix: '/mfa',
    }
)
.use(generate)
.use(create)
.use(verify)

export default xMfa