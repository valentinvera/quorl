import dotenv from "dotenv"
import { type Config, defineConfig } from "drizzle-kit"

dotenv.config({
  path: "../../apps/api/.env",
})

function getRequiredEnv(name: "DATABASE_AUTH_TOKEN" | "DATABASE_URL"): string {
  const value = process.env[name]

  if (!value) {
    throw new Error(`${name} must be configured in apps/api/.env`)
  }

  return value
}

export default defineConfig({
  dbCredentials: {
    authToken: getRequiredEnv("DATABASE_AUTH_TOKEN"),
    url: getRequiredEnv("DATABASE_URL"),
  },
  dialect: "turso",
  out: "./drizzle",
  schema: "./src/schema/*.ts",
} satisfies Config)
