
import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import initUser from './initUser'
import { loadConfig } from '../../libs';

const config = await loadConfig('user');

const PORT = config.service.port 
const HOST = config.service.host 

const app = new Elysia()
  .use(cors())
  .use(swagger(
    {
      path: '/swagger',
      documentation: {
        info: {
          title: "MetaflowX User Service of Ombaro API",
          version: "1.0.0",
          description: "MetaflowX User Service of Ombaro API Documentation"
        },
        servers: [
          {
            url: `${HOST === "localhost" ? `http://localhost:${PORT}` : `https:://${HOST}`}`,
            description: "User Server Running",
          },
        ],
      }

    }
  ))
  .get("/health", ({ set }) => {
    set.status = 200
    return { success: true, message: "MetaflowX Swap Service of Ombaro API Server is Healthy" }
  }, {
    tags: ["Health"],
  })
  .use(initUser)
  .listen(PORT)

console.log(`🦊 MetaflowX Swap Service of Ombaro API running at ${app.server?.hostname}:${app.server?.port}`)
