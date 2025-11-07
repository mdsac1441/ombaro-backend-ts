import Elysia from 'elysia';
import { loadConfig } from '../../libs';
import xAuthHandlers from './handlers';

const config = await loadConfig('auth');

export default config.service.enabled
  ? new Elysia()  
  : xAuthHandlers;