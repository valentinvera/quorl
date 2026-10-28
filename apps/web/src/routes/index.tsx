import { Button } from "@quorl/ui/components/button"
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { useCallback } from "react"
import { AgentRoster } from "@/components/agent-roster"
import { authClient } from "@/lib/auth-client"
import { getCurrentSession } from "@/server/session"

export const Route = createFileRoute("/")({
  beforeLoad: async () => {
    const session = await getCurrentSession()

    if (!session) {
      throw redirect({ to: "/login" })
    }

    return { session }
  },
  component: Workspace,
})

function Workspace() {
  const { session } = Route.useRouteContext()
  const router = useRouter()
  const navigate = useNavigate()

  const handleSignOut = useCallback(async () => {
    await authClient.signOut()
    await router.invalidate()
    await navigate({ to: "/login" })
  }, [router, navigate])

  return (
    <>
      <header className="border-border border-b">
        <div className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-3">
          <span className="font-medium text-small">Quorl</span>
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-caption text-muted-foreground">
              {session.user.email}
            </span>
            <Button
              onClick={handleSignOut}
              size="sm"
              type="button"
              variant="ghost"
            >
              Sign out
            </Button>
          </div>
        </div>
      </header>
      <main className="mx-auto w-full max-w-5xl px-6 py-10">
        <AgentRoster />
      </main>
    </>
  )
}
