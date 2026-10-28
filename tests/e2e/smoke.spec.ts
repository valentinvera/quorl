import { expect, test } from "@playwright/test"

const HEALTH_CHECK_PATH = "/trpc/healthCheck?batch=1&input=%7B%7D"
const LOGIN_URL_PATTERN = /\/login$/
const ATLAS_LINK_PATTERN = /Atlas/

test("signs up, delegates a message, and reaches the API", async ({
  page,
  request,
}, testInfo) => {
  const apiBaseUrl = testInfo.config.metadata.apiBaseUrl as string
  const browserErrors: string[] = []
  const failedRequests: string[] = []

  page.on("console", (message) => {
    if (message.type() === "error") {
      browserErrors.push(message.text())
    }
  })
  page.on("pageerror", (error) => {
    browserErrors.push(error.message)
  })
  page.on("requestfailed", (failedRequest) => {
    failedRequests.push(failedRequest.url())
  })

  await page.goto("/")
  await expect(page).toHaveURL(LOGIN_URL_PATTERN)
  await page.waitForFunction(
    () => document.documentElement.dataset.hydrated === "true"
  )
  await expect(
    page.getByRole("heading", { name: "Sign in to Quorl" })
  ).toBeVisible()

  await page
    .getByRole("button", { name: "New to Quorl? Create an account" })
    .click()
  await expect(
    page.getByRole("heading", { name: "Create your account" })
  ).toBeVisible()

  const email = `e2e-${crypto.randomUUID()}@quorl.local`
  await page.getByLabel("Name").fill("E2E Test")
  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("Sup3rSecret!42")
  await page.getByRole("button", { name: "Create account" }).click()

  await expect(page.getByRole("heading", { name: "Teammates" })).toBeVisible()
  await expect(page.getByText(email)).toBeVisible()
  await expect(page.getByText("No teammates yet")).toBeVisible()

  await page.getByRole("button", { name: "New teammate" }).click()
  await page.getByLabel("Name").fill("Atlas")
  await page.getByLabel("Role").fill("Research analyst")
  await page
    .getByLabel("Description")
    .fill("Finds sources and prepares the weekly research brief.")
  await page.getByRole("button", { name: "Create teammate" }).click()

  await expect(page.getByText("Atlas")).toBeVisible()
  await expect(page.getByText("Research analyst")).toBeVisible()

  await page.getByRole("link", { name: ATLAS_LINK_PATTERN }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Atlas" })
  ).toBeVisible()
  await expect(page.getByText("Give Atlas a task")).toBeVisible()

  await page
    .getByPlaceholder("Message Atlas...")
    .fill("Prepare the weekly research brief.")
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(
    page.getByText("Prepare the weekly research brief.")
  ).toBeVisible()

  await page.getByRole("link", { name: "Teammates" }).click()
  await expect(page.getByRole("heading", { name: "Teammates" })).toBeVisible()

  await page.getByRole("button", { name: "Sign out" }).click()
  await expect(
    page.getByRole("heading", { name: "Sign in to Quorl" })
  ).toBeVisible()

  await page.getByLabel("Email").fill(email)
  await page.getByLabel("Password").fill("Sup3rSecret!42")
  await page.getByRole("button", { name: "Sign in" }).click()
  await expect(page.getByRole("heading", { name: "Teammates" })).toBeVisible()

  await page.getByRole("link", { name: ATLAS_LINK_PATTERN }).click()
  await expect(
    page.getByText("Prepare the weekly research brief.")
  ).toBeVisible()

  const response = await request.get(`${apiBaseUrl}${HEALTH_CHECK_PATH}`)

  await expect(response).toBeOK()
  await expect(response.json()).resolves.toEqual([
    {
      result: {
        data: "OK",
      },
    },
  ])
  expect(browserErrors).toEqual([])
  expect(failedRequests).toEqual([])
})
