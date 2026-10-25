import { existsSync, readFileSync } from "node:fs"
import { resolve } from "node:path"
import { defineConfig, devices } from "@playwright/test"
import { parse } from "dotenv"

type DotEnvValues = Record<string, string>

function readDotEnvFile(path: string): DotEnvValues {
  if (!existsSync(path)) {
    return {}
  }

  return parse(readFileSync(path))
}

function getRequiredValue(value: string | undefined, name: string): string {
  if (!value) {
    throw new Error(`${name} must be configured before running Playwright`)
  }

  return value
}

function getRequiredPort(value: string | undefined, name: string): number {
  const port = Number(getRequiredValue(value, name))

  if (!Number.isInteger(port) || port <= 0) {
    throw new Error(`${name} must be a positive integer`)
  }

  return port
}

const apiDotEnv = readDotEnvFile(resolve("apps/api/.env"))
const webDotEnv = readDotEnvFile(resolve("apps/web/.env"))
const shouldStartServers = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "true"

const apiPort = getRequiredPort(
  process.env.PLAYWRIGHT_API_PORT ?? apiDotEnv.PORT,
  "PLAYWRIGHT_API_PORT or apps/api/.env PORT"
)
const webPort = getRequiredPort(
  process.env.PLAYWRIGHT_WEB_PORT ??
    process.env.VITE_PORT ??
    webDotEnv.VITE_PORT,
  "PLAYWRIGHT_WEB_PORT or apps/web/.env VITE_PORT"
)

const apiBaseUrl = getRequiredValue(
  process.env.PLAYWRIGHT_API_URL || apiDotEnv.BETTER_AUTH_URL,
  "PLAYWRIGHT_API_URL or apps/api/.env BETTER_AUTH_URL"
)
const webBaseUrl = getRequiredValue(
  process.env.PLAYWRIGHT_BASE_URL || apiDotEnv.CORS_ORIGIN,
  "PLAYWRIGHT_BASE_URL or apps/api/.env CORS_ORIGIN"
)

const braveExecutablePath =
  process.env.PLAYWRIGHT_BRAVE_EXECUTABLE_PATH ??
  process.env.PLAYWRIGHT_BROWSER_EXECUTABLE_PATH

const browserUse = braveExecutablePath
  ? {
      ...devices["Desktop Chrome"],
      launchOptions: {
        executablePath: braveExecutablePath,
      },
    }
  : devices["Desktop Chrome"]

const localApiEnv = {
  BETTER_AUTH_SECRET: getRequiredValue(
    process.env.BETTER_AUTH_SECRET || apiDotEnv.BETTER_AUTH_SECRET,
    "BETTER_AUTH_SECRET or apps/api/.env BETTER_AUTH_SECRET"
  ),
  BETTER_AUTH_TRUSTED_ORIGINS: getRequiredValue(
    process.env.BETTER_AUTH_TRUSTED_ORIGINS ||
      apiDotEnv.BETTER_AUTH_TRUSTED_ORIGINS,
    "BETTER_AUTH_TRUSTED_ORIGINS or apps/api/.env BETTER_AUTH_TRUSTED_ORIGINS"
  ),
  BETTER_AUTH_URL: apiBaseUrl,
  CORS_ORIGIN: webBaseUrl,
  DATABASE_AUTH_TOKEN: getRequiredValue(
    process.env.DATABASE_AUTH_TOKEN || apiDotEnv.DATABASE_AUTH_TOKEN,
    "DATABASE_AUTH_TOKEN or apps/api/.env DATABASE_AUTH_TOKEN"
  ),
  DATABASE_URL: getRequiredValue(
    process.env.DATABASE_URL || apiDotEnv.DATABASE_URL,
    "DATABASE_URL or apps/api/.env DATABASE_URL"
  ),
  HOST: getRequiredValue(
    process.env.HOST || apiDotEnv.HOST,
    "HOST or apps/api/.env HOST"
  ),
  PORT: String(apiPort),
}

const localWebEnv = {
  // TanStack Start's Nitro dev server reads PORT. Pin it to the web port so an
  // inherited PORT (for example from the API) cannot move the server elsewhere.
  PORT: String(webPort),
  VITE_API_URL: apiBaseUrl,
  VITE_HOST: getRequiredValue(
    process.env.VITE_HOST || webDotEnv.VITE_HOST,
    "VITE_HOST or apps/web/.env VITE_HOST"
  ),
  VITE_PORT: String(webPort),
  VITE_PROXY_COOKIE_DOMAIN_REWRITE: getRequiredValue(
    process.env.VITE_PROXY_COOKIE_DOMAIN_REWRITE ||
      webDotEnv.VITE_PROXY_COOKIE_DOMAIN_REWRITE,
    "VITE_PROXY_COOKIE_DOMAIN_REWRITE or apps/web/.env VITE_PROXY_COOKIE_DOMAIN_REWRITE"
  ),
  VITE_PROXY_SECURE: getRequiredValue(
    process.env.VITE_PROXY_SECURE || webDotEnv.VITE_PROXY_SECURE,
    "VITE_PROXY_SECURE or apps/web/.env VITE_PROXY_SECURE"
  ),
}

export default defineConfig({
  expect: {
    timeout: 5000,
  },
  fullyParallel: true,
  metadata: {
    apiBaseUrl,
    webBaseUrl,
  },
  outputDir: ".playwright-output/test-results",
  projects: [
    {
      name: braveExecutablePath ? "brave" : "chromium",
      use: browserUse,
    },
  ],
  reporter: [
    ["list"],
    ["html", { open: "never", outputFolder: ".playwright-output/report" }],
  ],
  retries: process.env.CI ? 2 : 0,
  testDir: "./tests/e2e",
  use: {
    baseURL: webBaseUrl,
    video: "on",
  },
  webServer: shouldStartServers
    ? [
        {
          command: "bun --cwd=apps/api run src/index.ts",
          env: localApiEnv,
          reuseExistingServer: false,
          timeout: 120_000,
          url: `${apiBaseUrl}/trpc/healthCheck?batch=1&input=%7B%7D`,
        },
        {
          command: "bun --cwd=apps/web run dev",
          env: localWebEnv,
          reuseExistingServer: false,
          timeout: 120_000,
          url: webBaseUrl,
        },
      ]
    : undefined,
  workers: 1,
})
