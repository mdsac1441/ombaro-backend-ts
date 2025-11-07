import { generateKeyPairSync } from 'node:crypto';
import {writeFileSync, mkdirSync, existsSync} from 'node:fs'
import { join } from 'node:path';
import { OMBARO_SECURE_KEYPAIR_PASSPHRASE } from '../src/libs';

const generateX25519EncryptionKeyPair = () => {
    /// Bun supports `NODE_ENV` (default: 'development')
    const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev';
    const configDir = join(import.meta.dir, '../src/configs', env);
    
    /// Ensure directory exists (Bun's `mkdirSync` is similar to Node's)
    if (!existsSync(configDir)) {
        mkdirSync(configDir, { recursive: true });
    }

    const PUBLIC_KEY = join(configDir, 'EncryptionAccessTokenPublicKey.pem');
    const PRIVATE_KEY = join(configDir, 'EncryptionAccessTokenPrivateKey.pem');

    if (existsSync(PUBLIC_KEY) || existsSync(PRIVATE_KEY)) {
        console.log(`Encryption keys already exist in ${configDir}, skipping generation.`);
        return;
    }

    const { publicKey, privateKey } = generateKeyPairSync('x25519', {
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
    writeFileSync(join(configDir, 'EncryptionAccessTokenPublicKey.pem'), publicKey);
    writeFileSync(join(configDir, 'EncryptionAccessTokenPrivateKey.pem'), privateKey);
}


const main = async () => {
    generateX25519EncryptionKeyPair()
}

main().catch(err => {
    console.error('JWT Key generation failed:', err);
    process.exit(1);
});