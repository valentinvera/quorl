import { expect, test } from "@playwright/test"

const HEALTH_CHECK_PATH = "/trpc/healthCheck?batch=1&input=%7B%7D"
const LOGIN_URL_PATTERN = /\/login$/
const ATLAS_LINK_PATTERN = /Atlas/
const RESEARCH_TEMPLATE_PATTERN = /Research analyst/

test("signs up, delegates, edits, duplicates, deletes teammates, and reaches the API", async ({
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
  await expect(page.getByText("Start with a template")).toBeVisible()

  await page.getByRole("button", { name: RESEARCH_TEMPLATE_PATTERN }).click()
  await expect(page.getByText("From template: Research analyst")).toBeVisible()
  await expect(page.getByLabel("Role")).toHaveValue("Research analyst")
  await expect(page.getByLabel("Instructions")).toHaveValue(
    "Cite every source. Keep briefs under one page and separate facts from recommendations."
  )
  await page.getByLabel("Name").fill("Atlas")
  await page.getByRole("button", { name: "Create teammate" }).click()

  await expect(page.getByText("Atlas")).toBeVisible()
  await expect(page.getByText("Research analyst")).toBeVisible()

  await page.getByRole("link", { name: ATLAS_LINK_PATTERN }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Atlas" })
  ).toBeVisible()
  await expect(page.getByText("Give Atlas a task")).toBeVisible()
  await expect(
    page.getByText(
      "Cite every source. Keep briefs under one page and separate facts from recommendations."
    )
  ).toBeVisible()

  await page
    .getByPlaceholder("Message Atlas...")
    .fill("Prepare the weekly research brief.")
  await page.getByRole("button", { name: "Send message" }).click()
  await expect(
    page.getByText("Prepare the weekly research brief.")
  ).toBeVisible()
  await expect(page.getByText("Today")).toBeVisible()

  await page.getByRole("button", { name: "Edit" }).click()
  await page.getByLabel("Name").fill("Atlas Prime")
  await page.getByLabel("Role").fill("Research lead")
  await page
    .getByLabel("Description")
    .fill("Leads research and prepares the weekly brief.")
  await page
    .getByLabel("Instructions")
    .fill("Cite sources and lead with the recommendation.")
  await page.getByRole("button", { name: "Save changes" }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Atlas Prime" })
  ).toBeVisible()
  await expect(page.getByText("Research lead")).toBeVisible()
  await expect(
    page.getByText("Cite sources and lead with the recommendation.")
  ).toBeVisible()
  await expect(
    page.getByText("Prepare the weekly research brief.")
  ).toBeVisible()

  await page.getByRole("button", { name: "Duplicate" }).click()
  await expect(
    page.getByRole("heading", { level: 1, name: "Atlas Prime copy" })
  ).toBeVisible()
  await expect(
    page.getByText("Cite sources and lead with the recommendation.")
  ).toBeVisible()

  await page.getByRole("button", { exact: true, name: "Delete" }).click()
  await expect(page.getByText("Delete Atlas Prime copy?")).toBeVisible()
  await page.getByRole("button", { name: "Delete teammate" }).click()
  await expect(page.getByRole("heading", { name: "Teammates" })).toBeVisible()
  await expect(page.getByText("Atlas Prime")).toBeVisible()

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
    page.getByRole("heading", { level: 1, name: "Atlas Prime" })
  ).toBeVisible()
  await expect(
    page.getByText("Cite sources and lead with the recommendation.")
  ).toBeVisible()
  await expect(
    page.getByText("Prepare the weekly research brief.")
  ).toBeVisible()

  await page.getByRole("button", { exact: true, name: "Delete" }).click()
  await expect(page.getByText("Delete Atlas Prime?")).toBeVisible()
  await page.getByRole("button", { name: "Delete teammate" }).click()
  await expect(page.getByRole("heading", { name: "Teammates" })).toBeVisible()
  await expect(page.getByText("No teammates yet")).toBeVisible()

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
