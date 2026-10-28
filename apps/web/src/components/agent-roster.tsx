import { Button } from "@quorl/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@quorl/ui/components/empty"
import { Skeleton } from "@quorl/ui/components/skeleton"
import { useQuery } from "@tanstack/react-query"
import { Link } from "@tanstack/react-router"
import { useCallback, useState } from "react"
import { CreateAgentForm } from "@/components/create-agent-form"
import { useTRPC } from "@/utils/trpc"

export function AgentRoster() {
  const trpc = useTRPC()
  const [isCreating, setIsCreating] = useState(false)

  const agentsQuery = useQuery(trpc.agent.list.queryOptions())
  const agents = agentsQuery.data

  const openForm = useCallback(() => setIsCreating(true), [])
  const closeForm = useCallback(() => setIsCreating(false), [])

  return (
    <section>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-caption text-muted-foreground">Workspace</p>
          <h1 className="mt-2 font-medium text-section">Teammates</h1>
          <p className="mt-2 max-w-lg text-body text-muted-foreground">
            Persistent AI teammates that own a clear area of work.
          </p>
        </div>
        {isCreating ? null : (
          <Button onClick={openForm} size="sm" type="button">
            New teammate
          </Button>
        )}
      </div>

      {isCreating ? (
        <div className="mt-6">
          <CreateAgentForm onCancel={closeForm} onCreated={closeForm} />
        </div>
      ) : null}

      {agentsQuery.error ? (
        <p className="mt-8 text-destructive-foreground text-small" role="alert">
          Could not load teammates: {agentsQuery.error.message}
        </p>
      ) : null}

      {agents === undefined && !agentsQuery.error ? (
        <div className="mt-8 flex flex-col gap-3">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      ) : null}

      {agents?.length === 0 ? (
        <Empty className="mt-8 border-border border-t py-16">
          <EmptyHeader>
            <EmptyTitle>No teammates yet</EmptyTitle>
            <EmptyDescription>
              Create a teammate with a clear role, then give it work to
              complete.
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      ) : null}

      {agents && agents.length > 0 ? (
        <ul className="mt-8 divide-y divide-border border-border border-t">
          {agents.map((agent) => (
            <li key={agent.id}>
              <Link
                className="-mx-3 flex flex-col gap-1 px-3 py-4 transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
                params={{ agentId: agent.id }}
                to="/agents/$agentId"
              >
                <div className="min-w-0">
                  <h2 className="font-medium text-medium">{agent.name}</h2>
                  {agent.description ? (
                    <p className="mt-1 text-muted-foreground text-small">
                      {agent.description}
                    </p>
                  ) : null}
                </div>
                <span className="shrink-0 text-caption text-muted-foreground">
                  {agent.role}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  )
}
