import { readFileSync,existsSync } from 'node:fs';
import { join } from 'node:path';
import { JWT_TYPE } from './loadAndConvertKeyPair';

/// keypair based on ed25519


export const loadJWTKeyPair = (label:JWT_TYPE = 'Access') => {
    const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev'
    const configDir = join(import.meta.dir, '../configs', env)
    
    const PUBLIC_KEY = join(configDir, `JWT${label}TokenPublicKey.pem`);
    const PRIVATE_KEY = join(configDir, `JWT${label}TokenPrivateKey.pem`);

    if(!existsSync(PUBLIC_KEY) || !existsSync(PRIVATE_KEY)) {
        throw new Error('JWTKeyPair not found in PEM file');
    }
    /// Read the public and private keys
   const JWTTokenPublicKey = readFileSync(PUBLIC_KEY, 'utf8');
   const JWTTokenPrivateKey = readFileSync(PRIVATE_KEY, 'utf8');

    return {
        pubKey: JWTTokenPublicKey,
        privateKey: JWTTokenPrivateKey
    }
}
