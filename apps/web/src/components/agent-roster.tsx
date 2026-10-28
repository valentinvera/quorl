import { type AgentTemplate, agentTemplates } from "@quorl/agents"
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

interface TemplateRowProps {
  onSelect: (template: AgentTemplate) => void
  template: AgentTemplate
}

function TemplateRow({ onSelect, template }: TemplateRowProps) {
  const handleClick = useCallback(() => {
    onSelect(template)
  }, [onSelect, template])

  return (
    <Button
      className="h-auto w-full flex-col items-start justify-start gap-1 whitespace-normal px-3 py-3 text-left"
      onClick={handleClick}
      type="button"
      variant="ghost"
    >
      <span className="font-medium text-medium">{template.role}</span>
      <span className="text-muted-foreground text-small">
        {template.description}
      </span>
    </Button>
  )
}

export function AgentRoster() {
  const trpc = useTRPC()
  const [isCreating, setIsCreating] = useState(false)
  const [template, setTemplate] = useState<AgentTemplate | null>(null)

  const agentsQuery = useQuery(trpc.agent.list.queryOptions())
  const agents = agentsQuery.data

  const openForm = useCallback(() => {
    setTemplate(null)
    setIsCreating(true)
  }, [])
  const openTemplate = useCallback((nextTemplate: AgentTemplate) => {
    setTemplate(nextTemplate)
    setIsCreating(true)
  }, [])
  const closeForm = useCallback(() => {
    setTemplate(null)
    setIsCreating(false)
  }, [])

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
          <CreateAgentForm
            onCancel={closeForm}
            onCreated={closeForm}
            template={template ?? undefined}
          />
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
        <div className="mt-8">
          <Empty className="border-border border-t py-12">
            <EmptyHeader>
              <EmptyTitle>No teammates yet</EmptyTitle>
              <EmptyDescription>
                Create a teammate with a clear role, then give it work to
                complete.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>

          {isCreating ? null : (
            <div className="border-border border-t pt-6">
              <p className="text-caption text-muted-foreground">
                Start with a template
              </p>
              <div className="mt-3 divide-y divide-border border-border border-t">
                {agentTemplates.map((agentTemplate) => (
                  <TemplateRow
                    key={agentTemplate.id}
                    onSelect={openTemplate}
                    template={agentTemplate}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
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
