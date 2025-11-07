import { Config, defineConfig } from 'drizzle-kit';

export default defineConfig({
  out: './migrations',
  schema: './src/databases/postgres/schema',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
}) satisfies Config;
