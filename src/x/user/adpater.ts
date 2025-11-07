import Elysia from 'elysia';
import { loadConfig } from '../../libs';
import xUserHandlers from './handlers';

const config = await loadConfig('user');

export default config.service.enabled
  ? new Elysia()  
  : xUserHandlers;