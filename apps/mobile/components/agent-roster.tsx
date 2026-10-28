import { type AgentTemplate, agentTemplates } from "@quorl/agents"
import { useQuery } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Button } from "heroui-native"
import { useCallback, useState } from "react"
import { Pressable, Text, View } from "react-native"
import { CreateAgentForm } from "@/components/create-agent-form"
import { trpc } from "@/utils/trpc"

interface AgentRowProps {
  agent: {
    description: string | null
    id: string
    name: string
    role: string
  }
}

function AgentRow({ agent }: AgentRowProps) {
  const router = useRouter()

  const handlePress = useCallback(() => {
    router.push({
      params: { agentId: agent.id },
      pathname: "/agents/[agentId]",
    })
  }, [router, agent.id])

  return (
    <Pressable
      accessibilityRole="button"
      className="gap-1 py-4"
      onPress={handlePress}
    >
      <View className="flex-row items-baseline justify-between gap-4">
        <Text className="font-geist-semibold text-foreground text-medium">
          {agent.name}
        </Text>
        <Text className="text-caption text-muted-foreground">{agent.role}</Text>
      </View>
      {agent.description ? (
        <Text className="text-muted-foreground text-small">
          {agent.description}
        </Text>
      ) : null}
    </Pressable>
  )
}

interface TemplateRowProps {
  onSelect: (template: AgentTemplate) => void
  template: AgentTemplate
}

function TemplateRow({ onSelect, template }: TemplateRowProps) {
  const handlePress = useCallback(() => {
    onSelect(template)
  }, [onSelect, template])

  return (
    <Pressable
      accessibilityRole="button"
      className="gap-1 py-3"
      onPress={handlePress}
    >
      <Text className="font-geist-semibold text-foreground text-medium">
        {template.role}
      </Text>
      <Text className="text-muted-foreground text-small">
        {template.description}
      </Text>
    </Pressable>
  )
}

export function AgentRoster() {
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
        <CreateAgentForm
          onCancel={closeForm}
          onCreated={closeForm}
          template={template ?? undefined}
        />
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
          <View className="items-center gap-2 py-8">
            <Text className="font-geist-semibold text-foreground text-medium">
              No teammates yet
            </Text>
            <Text className="text-center text-muted-foreground text-small">
              Create a teammate with a clear role, then give it work to
              complete.
            </Text>
          </View>

          {isCreating ? null : (
            <>
              <View className="bg-border" style={{ height: 1 }} />
              <View className="gap-3 py-6">
                <Text className="text-caption text-muted-foreground">
                  Start with a template
                </Text>
                <View>
                  {agentTemplates.map((agentTemplate) => (
                    <View key={agentTemplate.id}>
                      <View className="bg-border" style={{ height: 1 }} />
                      <TemplateRow
                        onSelect={openTemplate}
                        template={agentTemplate}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </>
          )}
        </View>
      ) : null}

      {agents && agents.length > 0 ? (
        <View>
          {agents.map((agent) => (
            <View key={agent.id}>
              <View className="bg-border" style={{ height: 1 }} />
              <AgentRow agent={agent} />
            </View>
          ))}
        </View>
      ) : null}
    </View>
  )
}
