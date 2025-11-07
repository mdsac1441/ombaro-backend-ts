import { Elysia } from 'elysia'
import { verifyKyc } from './verify'
import { request } from './request';
import { upload } from './upload';
import { submit } from './submit';
import { loadConfig } from '../../../libs';
import { updateDoc } from './uploadUpdate';
import { updateProfile } from './modify';
import { getUserStatus } from './readOne';
import { userBiometrics } from './userBiometrics';
import { updateSelfie } from './updateUserBiometrics';

const config = await loadConfig('kyc');

const  xKycHandlers = new Elysia(
    {
        prefix: '/kyc',
        tags: [`${!config.service.enabled?"Kyc Module":"Kyc"}`],
    }
)
.use(verifyKyc)
.use(request)
.use(upload)
.use(submit)
.use(updateDoc)
.use(updateProfile)
.use(getUserStatus)
.use(userBiometrics)
.use(updateSelfie)

export default xKycHandlers
