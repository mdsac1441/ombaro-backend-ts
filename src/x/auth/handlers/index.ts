import { Elysia } from 'elysia'
import { loadAndConvertKeyPair, loadConfig } from '../../../libs';
import { accessToken } from '../../../middlewares/helpers/accessToken';
import { jwtVerify, SignJWT } from "jose";
import { authMiddleware } from '../../../middlewares/authMiddleware';
import xSignup from './signup';
import xLogin from './login';
import xVerify from './verify';
import { xReset } from './reset';
import xMfa from './mfa';
const config = await loadConfig('auth');

const xAuthHandlers = new Elysia(
    {
        prefix: '/auth',
        tags: [`${!config.service.enabled ? "Auth Module" : "Auth"}`],
    }
)
    .use(xSignup)
    .use(xLogin)
    .use(xVerify)
    .use(xReset)
    .use(xMfa)

export default xAuthHandlers