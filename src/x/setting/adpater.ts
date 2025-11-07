import Elysia from 'elysia';
import { loadConfig } from '../../libs';
import xSettingHandlers from './handlers';

const config = await loadConfig('setting');

export default config.service.enabled
  ? new Elysia()  
  : xSettingHandlers;