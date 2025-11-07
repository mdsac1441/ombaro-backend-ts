import { Elysia, t } from "elysia";
import { accessToken, refreshToken } from "./helpers";
import bearer from "@elysiajs/bearer";
import type { JWTPayload } from "jose";
import { profileMeService } from "../x/user/services/profle/me";

type AuthContext = {
  type: 'access' | 'refresh' | 'platform';
  required: boolean;
  verify?: (token: string) => Promise<false | JWTPayload>;
  validateApiKey?: (key: string) => Promise<boolean>;
};

export const authMiddleware = (app: Elysia) =>
  app
    .use(bearer())
    .use(accessToken)
    .use(refreshToken)
    .derive(async ({ 
      accessJwt, 
      refreshJwt,
      bearer, 
      headers,
      set, 
      path 
    }) => {
      /// Determine auth context based on route and headers
      const getAuthContext = (): AuthContext => {
        const apiKey = headers['x-azx-key'];
        
        /// Platform API routes
        if (apiKey) {
          return {
            type: 'platform',
            required: true,
            validateApiKey: async (key: string) => {
              // Implement your platform key validation
              return validatePlatformKey(key);
            }
          };
        }

        /// Refresh token routes
        if (path.toLowerCase().includes('/fixed')) {
          return {
            type: 'refresh',
            required: false,
            verify: refreshJwt.verify
          };
        }

        /// Default to access token
        return {
          type: 'access',
          required: true,
          verify: accessJwt.verify
        };
      };

      const context = getAuthContext();

      try {
        // Platform API Key Authentication
        if (context.type === 'platform') {
          const apiKey = headers['x-azx-key'];
          if (!apiKey) {
            set.status = 401;
            throw new Error('X-AZX-KEY header is required');
          }

          const isValid = await context.validateApiKey?.(apiKey);
          if (!isValid) {
            set.status = 403;
            throw new Error('Invalid platform API key');
          }

          return { 
            authType: 'platform',
            platformKey: apiKey
          };
        }

        /// JWT Token Authentication
        if (!bearer && context.required) {
          set.status = 401;
          throw new Error(`${context.type} token is required`);
        }

        if (context.verify && bearer) {

          const payload = await context.verify(bearer);  
          
          if (!payload) {
            set.status = 403;
            throw new Error(`Invalid ${context.type} token`);
          }

          // Additional validation for access tokens
          if (context.type === 'access') {
            const authId = payload.sub as any as { id: string};
            
            if (!authId.id) {
              set.status = 403;
              throw new Error('Token missing user identifier');
            }
            const user = await profileMeService(authId.id)
            
            if (!user) {
              set.status = 403;
              throw new Error('User not found');
            }

            return { 
              authType: 'jwt',
              user: authId.id,
              tokenType: 'access'
            };
          }

          return { 
            authType: 'jwt',
            tokenPayload: payload,
            tokenType: context.type
          };
        }

        return { authType: 'none' };
        
      } catch (error) {
        if (error instanceof Error) {
          // Handle JWT expiration
          if (error.message.includes('expired')) {
            set.status = 401;
            throw new Error(`${context.type} token has expired`);
          }
          
          // Re-throw already handled errors
          if ([401, 403].includes(set.status as number)) {
            throw error;
          }
        }
        
        set.status = 500;
        throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }
    });

/// Implement these according to your platform
async function validatePlatformKey(key: string): Promise<boolean> {
  /// Add your platform key validation logic
  return key === process.env.PLATFORM_API_KEY;
}
