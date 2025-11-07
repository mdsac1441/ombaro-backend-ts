import { loadJWTKeyPair, pemToKeyObject } from ".";

export type JWT_TYPE = 'Access' | 'Refresh' | 'Reset' | 'Verification'

export const loadAndConvertKeyPair = (label: JWT_TYPE = 'Access' ) => {
    try {
        let { pubKey,privateKey } = loadJWTKeyPair(label);
        return {
            pubKey: pemToKeyObject(pubKey),
            privateKey: pemToKeyObject(privateKey)
        };
    } catch (error) {
        throw new Error(`Failed to load JWT key: ${error}`);
    }
}