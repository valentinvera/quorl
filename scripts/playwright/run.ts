import { spawn } from "node:child_process"
import { existsSync, readFileSync } from "node:fs"
import net from "node:net"
import { resolve } from "node:path"
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

function isPortAvailable(host: string, port: number): Promise<boolean> {
  return new Promise((resolvePortAvailability) => {
    const server = net.createServer()

    server.once("error", () => resolvePortAvailability(false))
    server.once("listening", () => {
      server.close(() => resolvePortAvailability(true))
    })
    server.listen(port, host)
  })
}

async function assertPortAvailable(
  host: string,
  port: number,
  name: string
): Promise<void> {
  if (!(await isPortAvailable(host, port))) {
    throw new Error(`${name} ${host}:${port} is already in use`)
  }
}

const apiDotEnv = readDotEnvFile(resolve("apps/api/.env"))
const webDotEnv = readDotEnvFile(resolve("apps/web/.env"))
const shouldStartServers = process.env.PLAYWRIGHT_SKIP_WEBSERVER !== "true"

const requestedApiPort = getRequiredPort(
  process.env.PLAYWRIGHT_API_PORT ?? apiDotEnv.PORT,
  "PLAYWRIGHT_API_PORT or apps/api/.env PORT"
)
const requestedWebPort = getRequiredPort(
  process.env.PLAYWRIGHT_WEB_PORT ??
    process.env.VITE_PORT ??
    webDotEnv.VITE_PORT,
  "PLAYWRIGHT_WEB_PORT or apps/web/.env VITE_PORT"
)
const apiHost = getRequiredValue(
  process.env.HOST || apiDotEnv.HOST,
  "HOST or apps/api/.env HOST"
)
const webHost = getRequiredValue(
  process.env.VITE_HOST || webDotEnv.VITE_HOST,
  "VITE_HOST or apps/web/.env VITE_HOST"
)

if (shouldStartServers) {
  await Promise.all([
    assertPortAvailable(apiHost, requestedApiPort, "API port"),
    assertPortAvailable(webHost, requestedWebPort, "Web port"),
  ])
}

const child = spawn("bunx", ["--bun", "playwright", ...process.argv.slice(2)], {
  env: process.env,
  stdio: "inherit",
})

child.on("exit", (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal)
    return
  }

  process.exit(code ?? 1)
})
