import { createClient } from "@libsql/client"
import { env } from "@quorl/env/api"
import { drizzle } from "drizzle-orm/libsql"
import { agentSchema } from "./schema/agent"
import { authSchema } from "./schema/auth"

export function createDb() {
  const client = createClient({
    authToken: env.DATABASE_AUTH_TOKEN,
    url: env.DATABASE_URL,
  })

  return drizzle({ client, schema: { ...authSchema, ...agentSchema } })
}

export const db = createDb()
