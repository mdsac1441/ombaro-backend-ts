
import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

export * from './common';
export * from './user';
export * from './auth'
export * from './referral'
export * from './kyc'

const DATABASE_URL = process.env.DATABASE_URL! 


if (!DATABASE_URL) {
    throw new Error("DATABASE_URL is not set in the environment variables.");
}

const client = postgres(DATABASE_URL);
export const DBClient = drizzle(client);