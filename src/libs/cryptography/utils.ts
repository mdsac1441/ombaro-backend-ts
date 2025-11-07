
export const b64 = (buf: Buffer) => buf.toString('base64')
export const fromB64 = (s: string) => Buffer.from(s, 'base64')
export const OMBARO_SECURE_KEYPAIR_PASSPHRASE = Bun.env.OMBARO_SECURE__KEYPAIR_PASSPHRASE! || 'Top Test Secret'
export const AES_ALGO = 'aes-256-gcm';
export const IV_LEN = 12; /// recommended for GCM
export const TAG_LEN = 16; /// GCM tag length

 export const buildAAD = (userId: string, purpose: string, keyId: string) => {
  return fromB64(JSON.stringify({ userId, purpose, keyId }));
}