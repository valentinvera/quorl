import { expo } from "@better-auth/expo"
import { createDb } from "@quorl/db"
import { authSchema } from "@quorl/db/schema/auth"
import { env } from "@quorl/env/api"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"

export function createAuth() {
  const db = createDb()

  return betterAuth({
    advanced: {
      defaultCookieAttributes: {
        httpOnly: true,
        sameSite: "none",
        secure: true,
      },
    },
    baseURL: env.BETTER_AUTH_URL,
    database: drizzleAdapter(db, {
      provider: "sqlite",

      schema: authSchema,
    }),
    emailAndPassword: {
      enabled: true,
    },
    plugins: [expo()],
    secret: env.BETTER_AUTH_SECRET,
    trustedOrigins: [env.CORS_ORIGIN, ...env.BETTER_AUTH_TRUSTED_ORIGINS],
  })
}

export const auth = createAuth()
