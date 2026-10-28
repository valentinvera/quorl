import { useQuery } from "@tanstack/react-query"
import { Button } from "heroui-native"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import { CreateAgentForm } from "@/components/create-agent-form"
import { trpc } from "@/utils/trpc"

export function AgentRoster() {
  const [isCreating, setIsCreating] = useState(false)

  const agentsQuery = useQuery(trpc.agent.list.queryOptions())
  const agents = agentsQuery.data

  const openForm = useCallback(() => setIsCreating(true), [])
  const closeForm = useCallback(() => setIsCreating(false), [])

  return (
    <View className="gap-8">
      <View className="gap-2">
        <Text className="font-geist-medium text-compact text-muted-foreground">
          Workspace
        </Text>
        <Text className="font-geist-semibold text-foreground text-section">
          Teammates
        </Text>
        <Text className="font-geist-regular text-body text-muted-foreground">
          Persistent AI teammates that own a clear area of work.
        </Text>
      </View>

      {isCreating ? (
        <CreateAgentForm onCancel={closeForm} onCreated={closeForm} />
      ) : (
        <Button onPress={openForm} variant="outline">
          <Button.Label>New teammate</Button.Label>
        </Button>
      )}

      {agentsQuery.error ? (
        <Text className="text-destructive-foreground text-small">
          Could not load teammates: {agentsQuery.error.message}
        </Text>
      ) : null}

      {agents === undefined && !agentsQuery.error ? (
        <Text className="text-muted-foreground text-small">
          Loading teammates...
        </Text>
      ) : null}

      {agents?.length === 0 ? (
        <View>
          <View className="bg-border" style={{ height: 1 }} />
          <View className="items-center gap-2 py-12">
            <Text className="font-geist-semibold text-foreground text-medium">
              No teammates yet
            </Text>
            <Text className="text-center text-muted-foreground text-small">
              Create a teammate with a clear role, then give it work to
              complete.
            </Text>
          </View>
        </View>
      ) : null}

      {agents && agents.length > 0 ? (
        <View>
          {agents.map((agent) => (
            <View key={agent.id}>
              <View className="bg-border" style={{ height: 1 }} />
              <View className="gap-1 py-4">
                <View className="flex-row items-baseline justify-between gap-4">
                  <Text className="font-geist-semibold text-foreground text-medium">
                    {agent.name}
                  </Text>
                  <Text className="text-caption text-muted-foreground">
                    {agent.role}
                  </Text>
                </View>
                {agent.description ? (
                  <Text className="text-muted-foreground text-small">
                    {agent.description}
                  </Text>
                ) : null}
              </View>
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}
