import { randomInt, randomBytes,createHash } from 'node:crypto'
import { TOKEN_HASH_CONFIG } from './loadHmacPepper'
import { timingSafeCompare } from './timingSafeCompare'

/**
 * author: Md Sharique Ahmed [Ahmed Chistey]
 * email: sharique@metaflowx.com
 * created: 2025-08-02
 * lastModified: 2025-08-02
 * version: 1.0.0
 * license: MIT
 * copyright: Copyright (c) 2025 MetaflowX Labs
 * description: This file contains utility functions for cryptographic operations.
 * It includes functions to generate a secure OTP, hash passwords, and verify passwords.
 * These functions are designed to be secure and efficient, leveraging Bun's built-in capabilities.
 * @module common
 * @requires node:crypto
 */


/**
 * Generates a cryptographically secure 6-digit OTP.
 * Uses `crypto.randomInt` (not Math.random()) to prevent predictability.
 * 
 * @returns {string} A 6-digit OTP (e.g., "123456").
 */
export const generateOTP = (): string => {
    const min = 100000 /// Minimum 6-digit number (100000)
    const max = 999999 /// Maximum 6-digit number (999999)

    /// Use crypto.randomInt for secure randomness (Bun supports Node's crypto module)
    const otp = randomInt(min, max + 1) /// +1 because max is exclusive

    return otp.toString().padStart(6, '0') /// Ensure 6 digits (e.g., "004567")
}

/** 
 * Generate hash for passwords using Bun's built-in password hashing
 * @param {string} password - The password to hash using bun's default algorithm argon2id
 * @returns {Promise<string>} The hashed password
 * @throws {Error} If hashing fails
 */

export const hashPassword = async (password: string): Promise<string> => {
    return await Bun.password.hash(password)
}

/**
 * Verify a password against a hashed password using Bun's built-in password verification
 * @param {string} password - The plain text password to verify
 * @param {string} hashedPassword - The hashed password to compare against
 * @returns {Promise<boolean>} True if the password matches, false otherwise
 * @throws {Error} If verification fails
 */

export const verifyPassword = async (password: string, hashedPassword: string): Promise<boolean> => {
    return await Bun.password.verify(password,  hashedPassword)
}


/**
 * Hashes a token with HMAC-SHA512 using a pepper and random salt
 */
export const hashToken = async (
    token: Bun.BlobOrStringOrBuffer
): Promise<{ hash: string, salt: string }> => {

    if (!TOKEN_HASH_CONFIG.pepper) {
        throw new Error('HMAC pepper not configured')
    }

    const salt = randomBytes(TOKEN_HASH_CONFIG.saltLength).toString('hex')

    const hasher = new Bun.CryptoHasher(
        TOKEN_HASH_CONFIG.algorithm,
        TOKEN_HASH_CONFIG.pepper
    )

    const hash = hasher
        .update(salt)
        .update(token)
        .digest('hex')

    return { hash, salt }
}

/**
 * Verifies a token against its hash and salt
 */
export const verifyToken = async (
    token: Bun.BlobOrStringOrBuffer,
    knownHashToken: string,
    salt: string
): Promise<boolean> => {
    if (!TOKEN_HASH_CONFIG.pepper) {
        throw new Error('HMAC pepper not configured')
    }
    if (!knownHashToken || !salt) {
        throw new Error('Known hash or salt is missing')
    }
    const hasher = new Bun.CryptoHasher(
        TOKEN_HASH_CONFIG.algorithm,
        TOKEN_HASH_CONFIG.pepper
    )

    const candidateHash = hasher
        .update(salt)
        .update(token)
        .digest('hex')

    /// Timing-safe comparison
    return timingSafeCompare(candidateHash, knownHashToken)
}



export const generateRandomNickname= (strategy: 'anonymous' | 'descriptive' = 'anonymous'): string => {
    if (strategy === 'descriptive') {
        const adjectives = [
            "Ombaro", "Swift", "Mighty", "Silent", "Brave", "Crazy",
            "Lucky", "Wild", "Cool", "Epic", "Smart", "Mfx"
        ];

        const nouns = [
            "Tiger", "Falcon", "Wolf", "Dragon", "Eagle",
            "Shark", "Panther", "Lion", "Bear", "Phoenix"
        ];
        const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
        const noun = nouns[Math.floor(Math.random() * nouns.length)];
        const number = Math.floor(10 + Math.random() * 9000); 

        return `${adjective}${noun}${number}`;
    }
    /// Default to 'anonymous'
    return "User-" + Math.random().toString(36).substring(2, 8);
}

export const generateReferralCode = (userId: string,len:number = 11): string => {
  return createHash("sha256")
    .update(userId)
    .digest("hex")
    .substring(0, len)
    .toUpperCase()
}

export const generateUID = (id: string, len: number = 11): string => {
  const hash = createHash("sha256")
    .update(id)
    .digest("hex")
    .toUpperCase();
  
  /// Take numeric characters from the hash to form the numeric part
  const numericHash = hash.replace(/[^0-9]/g, '');
  
  /// Ensure we have enough numeric characters
  const numericPart = numericHash.length >= len - 1 
    ? numericHash.substring(0, len - 1)
    : numericHash.padEnd(len - 1, '0'); // Pad with zeros if not enough numbers
  
  return `U${numericPart}`;
}
