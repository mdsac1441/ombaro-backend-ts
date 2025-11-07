import { Elysia } from 'elysia'
import { loadConfig } from '../../../libs'

const config = await loadConfig('setting')

const  xSettingHandlers = new Elysia(
    {
        prefix: '/setting',
        tags: [`${!config.service.enabled?"Setting Module":"Setting"}`],
    }
)

export default xSettingHandlers 
