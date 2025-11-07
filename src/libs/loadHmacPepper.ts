import { readFileSync } from 'node:fs';
import { join } from 'node:path';

const parsePemFile = (content: string): string => {
  const matches = content.match(/-----BEGIN HMAC PEPPER KEY-----([\s\S]+?)-----END HMAC PEPPER KEY-----/);
  if (!matches) throw new Error('Invalid HMAC pepper key format');
  return matches[1].replace(/\s+/g, '');
}

const loadHmacPepperKey = (): string => {
    const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev'
    const configDir = join(import.meta.dir, '../configs', env)
    const KEY_FILE = join(configDir, 'HmacPepperKey.pem');
    const pem = readFileSync(KEY_FILE, 'utf-8')
    const key = parsePemFile(pem)
    if (!key) {
        throw new Error('HMAC pepper key not found in PEM file');
    }
    return key
}

export const HMAC_PEPPER_KEY = loadHmacPepperKey()


export const TOKEN_HASH_CONFIG = {
  algorithm: 'sha512' as const, /// HMAC-SHA512
  pepper: HMAC_PEPPER_KEY, /// Loaded from the PEM file
  saltLength: 32, /// bytes
}
