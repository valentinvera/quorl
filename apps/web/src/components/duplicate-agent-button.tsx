import { Button } from "@quorl/ui/components/button"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useNavigate } from "@tanstack/react-router"
import { useCallback } from "react"
import { useTRPC } from "@/utils/trpc"

const COPY_SUFFIX = " copy"
const MAX_NAME_LENGTH = 80

interface DuplicableAgent {
  description: string | null
  instructions: string | null
  name: string
  role: string
}

function buildCopyName(name: string): string {
  const available = MAX_NAME_LENGTH - COPY_SUFFIX.length
  const base = name.length > available ? name.slice(0, available) : name

  return `${base}${COPY_SUFFIX}`
}

interface DuplicateAgentButtonProps {
  agent: DuplicableAgent
}

export function DuplicateAgentButton({ agent }: DuplicateAgentButtonProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const duplicateAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async (created) => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())

        if (created) {
          await navigate({
            params: { agentId: created.id },
            to: "/agents/$agentId",
          })
        }
      },
    })
  )
  const { error, isPending, mutate } = duplicateAgent

  const handleClick = useCallback(() => {
    mutate({
      description: agent.description ?? undefined,
      instructions: agent.instructions ?? undefined,
      name: buildCopyName(agent.name),
      role: agent.role,
    })
  }, [agent, mutate])

  return (
    <div className="flex flex-col items-end gap-1">
      <Button
        disabled={isPending}
        onClick={handleClick}
        size="sm"
        type="button"
        variant="ghost"
      >
        {isPending ? "Duplicating..." : "Duplicate"}
      </Button>
      {error ? (
        <p className="text-caption text-destructive-foreground" role="alert">
          {error.message}
        </p>
      ) : null}
    </div>
  )
}
