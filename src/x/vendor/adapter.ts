import Elysia from 'elysia';
import { loadConfig } from '../../libs';
import xReferralHandlers from './handlers';

const config = await loadConfig('referral');

export default config.service.enabled
  ? new Elysia()  
  : xReferralHandlers;