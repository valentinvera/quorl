import type { AppRouter } from "@quorl/trpc/routers/index"
import type { QueryClient } from "@tanstack/react-query"
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router"
import type { TRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { useEffect } from "react"
import globalsCss from "../styles/globals.css?url"

export interface RouterAppContext {
  queryClient: QueryClient
  trpc: TRPCOptionsProxy<AppRouter>
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootDocument,

  head: () => ({
    links: [
      {
        href: globalsCss,
        rel: "stylesheet",
      },
    ],
    meta: [
      {
        charSet: "utf-8",
      },
      {
        content: "width=device-width, initial-scale=1",
        name: "viewport",
      },
      {
        title: "Quorl",
      },
    ],
  }),
})

function RootDocument() {
  useEffect(() => {
    document.documentElement.dataset.hydrated = "true"
  }, [])

  return (
    <html className="dark" lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <div className="grid h-svh grid-rows-[auto_1fr]">
          <Outlet />
        </div>
        <Scripts />
      </body>
    </html>
  )
}
