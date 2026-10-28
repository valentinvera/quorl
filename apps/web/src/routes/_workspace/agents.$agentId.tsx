import { createFileRoute } from "@tanstack/react-router"
import { AgentConversation } from "@/components/agent-conversation"

export const Route = createFileRoute("/_workspace/agents/$agentId")({
  component: AgentConversationRoute,
})

function AgentConversationRoute() {
  const { agentId } = Route.useParams()

  return <AgentConversation agentId={agentId} />
}
