import "dotenv/config"
import { createEnv } from "@t3-oss/env-core"
import { z } from "zod"

const trustedOriginsSchema = z
  .string()
  .transform((value) =>
    value
      .split(",")
      .map((origin) => origin.trim())
      .filter(Boolean)
  )
  .pipe(z.array(z.string().min(1)).min(1))

export const env = createEnv({
  emptyStringAsUndefined: true,
  runtimeEnv: process.env,
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_TRUSTED_ORIGINS: trustedOriginsSchema,
    BETTER_AUTH_URL: z.url(),
    CORS_ORIGIN: z.url(),
    DATABASE_AUTH_TOKEN: z.string().min(1),
    DATABASE_URL: z.string().min(1),
    HOST: z.string().min(1),
    PORT: z.coerce.number().int().positive(),
  },
})
