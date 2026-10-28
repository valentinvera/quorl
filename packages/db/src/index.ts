import { createClient } from "@libsql/client"
import { env } from "@quorl/env/api"
import { drizzle } from "drizzle-orm/libsql"
import { agentSchema } from "./schema/agent"
import { authSchema } from "./schema/auth"
import { messageSchema } from "./schema/message"

export function createDb() {
  const client = createClient({
    authToken: env.DATABASE_AUTH_TOKEN,
    url: env.DATABASE_URL,
  })

  return drizzle({
    client,
    schema: { ...authSchema, ...agentSchema, ...messageSchema },
  })
}

export const db = createDb()
