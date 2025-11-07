import crypto from 'node:crypto';

export const generateCsrfToken = () => {
    return crypto.randomBytes(24).toString("hex");
}