import { existsSync, readFileSync } from 'node:fs';
import { join } from 'node:path';

/// keypair based on x25519

export const loadEncryptionKeyPair = () => {
    const env = Bun.env.NODE_ENV === 'production' ? 'prod' : 'dev'
    const configDir = join(import.meta.dir, '../configs', env)

    const PUBLIC_KEY = join(configDir, 'EncryptionAccessTokenPublicKey.pem');
    const PRIVATE_KEY = join(configDir, 'EncryptionAccessTokenPrivateKey.pem');

    if (!existsSync(PUBLIC_KEY) || !existsSync(PRIVATE_KEY)) {
        throw new Error('EncryptionKeyPair not found in PEM file');
    }
    /// Read the public and private keys
    const EncryptionAccessTokenPublicKey = readFileSync(PUBLIC_KEY, 'utf8');
    const EncryptionAccessTokenPrivateKey = readFileSync(PRIVATE_KEY, 'utf8');

    return {
        pubKey: EncryptionAccessTokenPublicKey,
        privateKey: EncryptionAccessTokenPrivateKey
    }
}