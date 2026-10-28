import { useLocalSearchParams } from "expo-router"
import { View } from "react-native"
import { AgentConversation } from "@/components/agent-conversation"

export default function AgentConversationRoute() {
  const { agentId } = useLocalSearchParams<{ agentId: string }>()

  if (!agentId) {
    return <View className="flex-1 bg-background" />
  }

  return <AgentConversation agentId={agentId} />
}
