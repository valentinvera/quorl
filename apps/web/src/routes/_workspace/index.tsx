import { createFileRoute } from "@tanstack/react-router"
import { AgentRoster } from "@/components/agent-roster"

export const Route = createFileRoute("/_workspace/")({
  component: RosterPage,
})

function RosterPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-10">
      <AgentRoster />
    </div>
  )
}
