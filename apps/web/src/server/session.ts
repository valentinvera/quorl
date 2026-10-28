import { createServerFn } from "@tanstack/react-start"
import { getRequestHeaders } from "@tanstack/react-start/server"
import { authClient } from "@/lib/auth-client"

export const getCurrentSession = createServerFn({ method: "GET" }).handler(
  async () => {
    const session = await authClient.getSession({
      fetchOptions: {
        headers: getRequestHeaders(),
        throw: true,
      },
    })

    return session
  }
)
