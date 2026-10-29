import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Button } from "heroui-native"
import { useCallback } from "react"
import { Text, View } from "react-native"
import { trpc } from "@/utils/trpc"

const COPY_SUFFIX = " copy"
const MAX_NAME_LENGTH = 80

interface DuplicableAgent {
  description: string | null
  id: string
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
  const router = useRouter()
  const queryClient = useQueryClient()

  const duplicateAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async (created) => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())

        if (created) {
          router.push({
            params: { agentId: created.id },
            pathname: "/agents/[agentId]",
          })
        }
      },
    })
  )
  const { error, isPending, mutate } = duplicateAgent

  const handlePress = useCallback(() => {
    mutate({
      description: agent.description ?? undefined,
      instructions: agent.instructions ?? undefined,
      name: buildCopyName(agent.name),
      role: agent.role,
    })
  }, [agent, mutate])

  return (
    <View className="gap-1">
      <Button isDisabled={isPending} onPress={handlePress} variant="ghost">
        <Button.Label>
          {isPending ? "Duplicating..." : "Duplicate"}
        </Button.Label>
      </Button>
      {error ? (
        <Text className="text-caption text-destructive-foreground">
          {error.message}
        </Text>
      ) : null}
    </View>
  )
}
