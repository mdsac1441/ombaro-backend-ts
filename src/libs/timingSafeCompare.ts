import { timingSafeEqual } from 'node:crypto';
/**
 * Timing-safe string comparison
 */
export const timingSafeCompare = (a: string, b: string): boolean => {
  const aBuf = Buffer.from(a, 'utf8');
  const bBuf = Buffer.from(b, 'utf8');
  return aBuf.length === bBuf.length && 
        timingSafeEqual(aBuf, bBuf);
}