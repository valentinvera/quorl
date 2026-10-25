import { expect, test } from "@playwright/test"

const HEALTH_CHECK_PATH = "/trpc/healthCheck?batch=1&input=%7B%7D"

test("loads the app and reaches the API", async ({
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
  await expect(
    page.getByRole("heading", {
      name: "Quorl",
    })
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
