
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from '@/db/schema/schema.ts'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl) {
  throw new Error('DATABASE_URL is not set. Configure a connection string in your env or use the script db:seed with cross-env.')
}

export const db = drizzle(databaseUrl, {
  schema,
  casing: 'snake_case',
})



