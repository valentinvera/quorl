import { env } from "@quorl/env/mobile"
import type { AppRouter } from "@quorl/trpc/routers/index"
import { QueryClient } from "@tanstack/react-query"
import { createTRPCClient, httpBatchLink } from "@trpc/client"
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query"
import { Platform } from "react-native"
import { authClient } from "@/lib/auth-client"

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
})
const trpcClient = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      fetch(url, options) {
        return globalThis.fetch(url, {
          ...options,
          credentials: Platform.OS === "web" ? "include" : "omit",
        })
      },
      async headers() {
        if (Platform.OS === "web") {
          return {}
        }
        const headers = new Map<string, string>()
        const cookies = await authClient.getCookie()
        if (cookies) {
          headers.set("Cookie", cookies)
        }
        return Object.fromEntries(headers)
      },
      url: `${env.EXPO_PUBLIC_API_URL}/api/trpc`,
    }),
  ],
})

export const trpc = createTRPCOptionsProxy<AppRouter>({
  client: trpcClient,
  queryClient,
})
