import { type Elysia } from 'elysia'

export const securityMiddleware = (app: Elysia) => 
    app
      .onRequest((ctx) => {
        /// Filter out any array-valued headers (like 'set-cookie')
        const safeHeaders: Record<string, string | number> = {};
        for (const [key, value] of Object.entries(ctx.set.headers ?? {})) {
          if (typeof value === 'string' || typeof value === 'number') {
            safeHeaders[key] = value;
          }
        }
        /// Set security headers
        ctx.set.headers = {
          ...safeHeaders,
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Strict-Transport-Security': 'max-age=63072000; includeSubDomains; preload'
        }
      })
      .onError(({ code }) => {
        /// Security-focused error handling
        if (code === 'NOT_FOUND') {
          return new Response('Not Found', { status: 404 })
        }

        /// Don't leak internal errors
        return new Response('An error occurred', { status: 500 })
    })
