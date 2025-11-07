import { Elysia } from 'elysia'
import { loadConfig } from '../../../libs'
import { readOne } from './readOne'
import { readList } from './readList'

const config = await loadConfig('vendor')

const  xVendorHandlers = new Elysia(
    {
        prefix: '/vendor',
        tags: [`${!config.service.enabled?"Vendor Module":"Vendor"}`],
    }
)
.use(readOne)
.use(readList)

export default xVendorHandlers 
