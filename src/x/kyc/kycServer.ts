
import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import xKycHandlers from './handlers'
import { loadConfig } from '../../libs';

const config = await loadConfig('auth');

const PORT = config.service.port 
const HOST = config.service.host 

const app = new Elysia()
  .use(cors())
  .use(swagger(
    {
      path: '/swagger',
      documentation: {
        info: {
          title: "MetaflowX Kyc Service of Ombaro API",
          version: "1.0.0",
          description: "MetaflowX Kyc Service of Ombaro API Documentation"
        },
        servers: [
          {
            url: `${HOST === "localhost" ? `http://localhost:${PORT}` : `https:://${HOST}`}`,
            description: " Kyc Server Running",
          },
        ],
      }

    }
  ))
  .get("/health", ({ set }) => {
    set.status = 200
    return { success: true, message: "MetaflowX Kyc Service of Ombaro API Server is Healthy" }
  }, {
    tags: ["Health"],
  })
  .use(xKycHandlers)
  .listen(5005)

console.log(`🦊 MetaflowX Kyc Service of Ombaro API running at ${app.server?.hostname}:${app.server?.port}`)
