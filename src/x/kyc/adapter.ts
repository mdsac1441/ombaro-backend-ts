import Elysia from 'elysia';
import { loadConfig } from '../../libs';
import xKycHandlers from './handlers';

const config = await loadConfig('kyc');

export default config.service.enabled
  ? new Elysia()  
  : xKycHandlers;