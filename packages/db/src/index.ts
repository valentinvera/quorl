import { createClient } from "@libsql/client"
import { env } from "@quorl/env/api"
import { drizzle } from "drizzle-orm/libsql"
import { authSchema } from "./schema/auth"

export function createDb() {
  const client = createClient({
    authToken: env.DATABASE_AUTH_TOKEN,
    url: env.DATABASE_URL,
  })

  return drizzle({ client, schema: authSchema })
}

export const db = createDb()
