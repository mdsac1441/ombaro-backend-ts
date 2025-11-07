
import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import initAuth from './initAuth'
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
          title: "MetaflowX Auth Service of Ombaro API",
          version: "1.0.0",
          description: "MetaflowX Auth Service of Ombaro API Documentation"
        },
        servers: [
          {
            url: `${HOST === "localhost" ? `http://localhost:${PORT}` : `https:://${HOST}`}`,
            description: " Auth Server Running",
          },
        ],
      }

    }
  ))
  .get("/health", ({ set }) => {
    set.status = 200
    return { success: true, message: "MetaflowX Auth Service of Ombaro API Server is Healthy" }
  }, {
    tags: ["Health"],
  })
  .use(initAuth)
  .listen(PORT)

console.log(`🦊 MetaflowX Auth Service of Ombaro API running at ${app.server?.hostname}:${app.server?.port}`)
