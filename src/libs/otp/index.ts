import { redis } from "../../databases/redis";
import { OMBARO_OTP_EXPIRY } from "../../x/shared/constant";
import crypto from 'node:crypto'

const OTP_EXPIRY = OMBARO_OTP_EXPIRY
const MAX_ATTEMPTS = 3; /// Max verification attempts
const COOLDOWN_PERIOD = 300; /// 5 min lock after max attempts

type OTP_TYPE = 'SMS' | 'EMAIL'

export const verifyOTP = async (userId: string,otp: string, type: OTP_TYPE, ip?: string) => {
    const key = `mfa:otp:${userId}:${type}`;
    const attemptKey = `mfa:attempts:${userId}:${type}`;
    const lockKey = `mfa:lock:${userId}:${type}`;

    const ipKey = `mfa:ip:${userId}:${type}`;

    if (ip && await redis.exists(`mfa:lock:ip:${ip}`)) {
        throw new Error("This IP is temporarily locked. Try again later.");
    }
    if (ip) {
        const ipLockKey = `mfa:lock:ip:${ip}`;
        const ipAttemptKey = `mfa:attempts:ip:${ip}`;
        const ipAttempts = parseInt(await redis.get(ipAttemptKey) || "0");
        /// e.g. block after 10 wrong tries in 5 mins
        if (ipAttempts >= 10) {
            await redis.set(ipLockKey, "1", "EX", 300)
            throw new Error("Too many attempts from this IP. Please try again later.");
        }
    }

    /// Check if account is locked
    const isLocked = await redis.exists(lockKey);
    if (isLocked) {
        throw new Error("Account temporarily locked. Please try again later.");
    }

    /// Check attempt counter
    const attempts = parseInt(await redis.get(attemptKey) || '0');
    if (attempts >= MAX_ATTEMPTS) {
        await redis.set(lockKey, "1", "EX", COOLDOWN_PERIOD);
        await redis.del(attemptKey);
        throw new Error("Too many failed attempts. Account locked for 5 minutes.");
    }

    /// IP check
    const storedIP = await redis.get(ipKey);
    if (storedIP && ip && storedIP !== ip) {
        await redis.incr(attemptKey);
        await redis.expire(attemptKey, 3600);
        throw new Error("OTP verification attempt from unauthorized IP.");
    }

    /// OTP check
    const stored = await redis.get(key);
    if (!stored) {
        await redis.incr(attemptKey);
        await redis.expire(attemptKey, 3600); /// Keep attempt counter for 1 hour

        if (ip) {
            const ipAttemptKey = `mfa:attempts:ip:${ip}`;
            await redis.incr(ipAttemptKey);
            await redis.expire(ipAttemptKey, 300); /// 5 min rolling window
        }
        return false;
    }
    /// compare hashes instead of raw OTP
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    if (stored !== hashedOTP) {
        await redis.incr(attemptKey);
        await redis.expire(attemptKey, 3600);

        if (ip) {
            const ipAttemptKey = `mfa:attempts:ip:${ip}`;
            await redis.incr(ipAttemptKey);
            await redis.expire(ipAttemptKey, 300);
        }
        return false;
    }

    /// Successful verification
    await redis.del(key);
    await redis.del(attemptKey);
    await redis.del(ipKey);
    return true;
}

export const storeOTPWithSecurity = async (userId: string, otp: string, type: OTP_TYPE, ip?: string) => {
    const key = `mfa:otp:${userId}:${type}`;
    const ipKey = `mfa:ip:${userId}:${type}`;
    const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
    /// Store IP for verification
    if (ip) {
        await redis.set(ipKey, ip, "EX", OTP_EXPIRY);
    }
    await redis.set(key, hashedOTP, "EX", OTP_EXPIRY);
}