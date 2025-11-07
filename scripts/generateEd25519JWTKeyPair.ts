import { generateKeyPairSync } from 'node:crypto';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs'
import { join } from 'node:path';
import { OMBARO_SECURE_KEYPAIR_PASSPHRASE } from '../src/libs';

type JWT_TYPE = 'Access' | 'Refresh' | 'Reset' | 'Verification'

const generateEd25519JWTKeyPair = (label : JWT_TYPE = 'Access') => {
    /// Bun supports `NODE_ENV` (default: 'development')
    
    const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const configDir = join(import.meta.dir, '../src/configs', env);
    /// Ensure directory exists (Bun's `mkdirSync` is similar to Node's)
    if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
    }

    const PUBLIC_KEY = join(configDir, `JWT${label}TokenPublicKey.pem`);
    const PRIVATE_KEY = join(configDir, `JWT${label}TokenPrivateKey.pem`);

    if (existsSync(PUBLIC_KEY) || existsSync(PRIVATE_KEY)) {
        console.log(`JWT keys already exist in ${configDir}, skipping generation.`);
        return;
    }
    const { publicKey, privateKey } = generateKeyPairSync('ed25519', {
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem',
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: OMBARO_SECURE_KEYPAIR_PASSPHRASE
        },
    })
    /// Save keys (Bun's `writeFileSync` is faster than Node's)
    writeFileSync(join(configDir, `JWT${label}TokenPublicKey.pem`), publicKey);
    writeFileSync(join(configDir, `JWT${label}TokenPrivateKey.pem`), privateKey);
}

const main = async () => {
    generateEd25519JWTKeyPair('Verification')
}

main().catch(err => {
    console.error('JWT Key generation failed:', err);
    process.exit(1);
});