import cors from "@elysiajs/cors"
import swagger from "@elysiajs/swagger"
import { Elysia } from "elysia"
import initX from "./initX"


const PORT = Bun.env.PORT || 5000
const HOST = Bun.env.HOST || "localhost"

const app = new Elysia()
  .use(cors())
  .use(swagger(
    {
      path: "/swagger",
      documentation: {
        info: {
          title: "Ombaro Backend API By MetaflowX",
          version: "1.0.0",
          description: "Ombaro Backend API Documentation",
        },
        servers: [
          {
            url: `${HOST === "localhost" ? `http://localhost:${PORT}` : `https://${HOST}`}`,
            description: "Server Running",
          },
        ],
        components: {
          securitySchemes: {
            BearerAuth: {
              type: "http",
              scheme: "bearer",
              bearerFormat: "JWT", /// Optional: Specifies the format
            }
          },
        },
        security: [
          {
            BearerAuth: [],
            ApiAuth: [],
          },
        ],
      }

    }
  ))
  .get("/health", ({ set }) => {
    set.status = 200
    return { success: true, message: "Ombaro Backend API Server is Healthy" }
  }, {
    tags: ["Health"],
  })
  .use(initX)
  .listen(PORT)

console.log(
  `🦊 Ombaro Backend API is running at ${app.server?.hostname}:${app.server?.port}`
)

