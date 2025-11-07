import { createPrivateKey, createPublicKey } from "node:crypto";
import { OMBARO_SECURE_KEYPAIR_PASSPHRASE } from '.';

export const pemToKeyObject = (pem: string) => {
    return pem.includes('PRIVATE KEY')
        ? 
        createPrivateKey({ key: pem,type: 'pkcs8', format: 'pem', passphrase: OMBARO_SECURE_KEYPAIR_PASSPHRASE })
        : 
        createPublicKey({ key: pem,type: 'pkcs1', format: 'pem' });

};