import { config as loadEnv } from 'dotenv'
import { defineConfig, env } from 'prisma/config'

// Next.js reads `.env.local` automatically; point the Prisma CLI at the
// same file so there's a single place to put the real DATABASE_URL
// instead of a separate `.env` only Prisma knows about.
loadEnv({ path: '.env.local' })

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: env('DATABASE_URL'),
  },
})
