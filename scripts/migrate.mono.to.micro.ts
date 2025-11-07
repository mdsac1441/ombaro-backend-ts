import { $ } from 'bun'

function formatModuleName(rawName: string) {
  const cleaned = rawName.replace(/[-_]/g, ' ');
  return cleaned.split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

const module = Bun.argv[2]
const host = Bun.argv[3] || 'localhost'
const port = Bun.argv[4] || 5001
const modulePath = `src/x/${module.toLowerCase()}`

const displayName = formatModuleName(module);


/// 1. Create init file for module

const initTemplate = `
import { Elysia } from 'elysia'
import x${displayName}Handlers from './handlers'

const init${displayName} = new Elysia({ prefix: 'api/v1' })
.use(x${displayName}Handlers)

export default init${displayName}
`
await Bun.write(`${modulePath}/init${displayName}.ts`, initTemplate)

/// 2. Create  server file
const serverTemplate = `
import { Elysia } from 'elysia'
import cors from '@elysiajs/cors'
import swagger from '@elysiajs/swagger'
import init${displayName} from './init${displayName}'
import { loadConfig } from '../../libs';

const config = await loadConfig('${module.toLowerCase()}');

const PORT = config.service.port 
const HOST = config.service.host 

const app = new Elysia()
  .use(cors())
  .use(swagger(
    {
      path: '/swagger',
      documentation: {
        info: {
          title: "MetaflowX ${displayName} Service of Ombaro API",
          version: "1.0.0",
          description: "MetaflowX ${displayName} Service of Ombaro API Documentation"
        },
        servers: [
          {
            url: \`\${HOST === "localhost" ? "http://localhost:\${PORT}\" : \`https://\${HOST}\`}\`,
            description: " ${displayName} Server Running",
          },
        ],
      }

    }
  ))
  .get("/health", ({ set }) => {
    set.status = 200
    return { success: true, message: "MetaflowX ${displayName} Service of Ombaro API Server is Healthy" }
  }, {
    tags: ["Health"],
  })
  .use(init${displayName})
  .listen(PORT)

console.log(\`🦊 MetaflowX ${displayName} Service of Ombaro API running at \${app.server?.hostname}:\${app.server?.port}\`)
`

await Bun.write(`${modulePath}/${module}Server.ts`, serverTemplate)

// // 2. Create Dockerfile
// const dockerTemplate = `
// FROM oven/bun:alpine

// WORKDIR /app
// COPY package.json .
// COPY ${modulePath} ./${modulePath}

// RUN bun i

// EXPOSE ${port}
// CMD ["bun", "run", "${modulePath}/${module}Server.ts"]
// `

// await Bun.write(`${modulePath}/Dockerfile`, dockerTemplate)

// 3. Update package.json scripts
const pkg = await Bun.file('package.json').json()
pkg.scripts = pkg.scripts || {}
pkg.scripts[`dev:${module}`] = `bun run --watch ${modulePath}/${module}Server.ts`
pkg.scripts[`start:${module}`] = `bun run ${modulePath}/${module}Server.ts`
pkg.scripts[`docker:${module}`] = `docker build -f ${modulePath}/Dockerfile -t ${module}-service .`

await Bun.write('package.json', JSON.stringify(pkg, null, 2))

// 4. Update module config
const configTemplate = `
[service]
enabled = true
port = ${port}
host = "${host}"

[database]
shared = false  # Set to true if using monolith DB
`

await Bun.write(`${modulePath}/config.toml`, configTemplate)

// // 5. Add to docker-compose.yml
// const composeUpdate = `
//   ${module}-service:
//     build:
//       context: .
//       dockerfile: ${modulePath}/Dockerfile
//     ports:
//       - "${port}:${port}"
//     environment:
//       NODE_ENV: production
//     restart: unless-stopped
// `

// await $`echo "${composeUpdate}" >> docker-compose.yml`

console.log(`
✅ ${module} microservice ready!

Commands:
  bun run start:${module}    # Run standalone
  bun run docker:${module}  # Build Docker image
  docker-compose up -d      # Start with compose

Swagger Docs: http://localhost:${port}/swagger/${module}
`)