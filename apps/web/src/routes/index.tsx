import { Button } from "@quorl/ui/components/button"
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { useCallback } from "react"
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
      <header className="flex items-center justify-between border-border border-b px-6 py-3">
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
      </header>
      <main className="px-6 py-16">
        <div className="max-w-md">
          <h1 className="font-medium text-section">Your workspace</h1>
          <p className="mt-2 text-body text-muted-foreground">
            No teammates yet. Your first Quorl teammate will appear here.
          </p>
        </div>
      </main>
    </>
  )
}
