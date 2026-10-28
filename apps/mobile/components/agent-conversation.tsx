import { Ionicons } from "@expo/vector-icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Button, Input } from "heroui-native"
import { useCallback, useEffect, useRef, useState } from "react"
import { Pressable, Text, View } from "react-native"
import {
  KeyboardAvoidingView,
  KeyboardAwareScrollView,
  type KeyboardAwareScrollViewRef,
} from "react-native-keyboard-controller"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { withUniwind } from "uniwind"
import { EditAgentForm } from "@/components/edit-agent-form"
import { trpc } from "@/utils/trpc"

const StyledIonicons = withUniwind(Ionicons)

interface AgentConversationProps {
  agentId: string
}

export function AgentConversation({ agentId }: AgentConversationProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const scrollRef = useRef<KeyboardAwareScrollViewRef>(null)

  const agentQuery = useQuery(trpc.agent.get.queryOptions({ id: agentId }))
  const messagesQuery = useQuery(trpc.message.list.queryOptions({ agentId }))
  const sendMessage = useMutation(
    trpc.message.send.mutationOptions({
      onSuccess: async () => {
        setContent("")
        await queryClient.invalidateQueries(trpc.message.list.queryFilter())
      },
    })
  )
  const {
    error: sendError,
    isPending: isSending,
    mutate: sendMessageMutation,
  } = sendMessage

  const messages = messagesQuery.data ?? []
  const agentName = agentQuery.data?.name ?? "your teammate"

  useEffect(() => {
    if (messages.length === 0) {
      return
    }

    scrollRef.current?.scrollToEnd({ animated: true })
  }, [messages.length])

  const handleBack = useCallback(() => {
    if (router.canGoBack()) {
      router.back()
      return
    }

    router.replace("/")
  }, [router])

  const handleContentChange = useCallback((value: string) => {
    setContent(value)
  }, [])

  const submitMessage = useCallback(() => {
    const trimmed = content.trim()

    if (!trimmed || isSending) {
      return
    }

    sendMessageMutation({ agentId, content: trimmed })
  }, [agentId, content, isSending, sendMessageMutation])

  const handleSendPress = useCallback(() => {
    submitMessage()
  }, [submitMessage])

  const handleSubmitEditing = useCallback(() => {
    submitMessage()
  }, [submitMessage])

  const startEditing = useCallback(() => setIsEditing(true), [])
  const stopEditing = useCallback(() => setIsEditing(false), [])

  if (agentQuery.error) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <Text className="text-center text-destructive-foreground text-small">
          Could not load teammate: {agentQuery.error.message}
        </Text>
        <Button onPress={handleBack} variant="outline">
          <Button.Label>Back to teammates</Button.Label>
        </Button>
      </View>
    )
  }

  if (agentQuery.data === undefined) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <Text className="text-muted-foreground text-small">
          Loading teammate...
        </Text>
      </View>
    )
  }

  if (agentQuery.data === null) {
    return (
      <View className="flex-1 items-center justify-center gap-3 bg-background px-6">
        <Text className="text-center font-geist-semibold text-foreground text-medium">
          Teammate not found
        </Text>
        <Text className="text-center text-muted-foreground text-small">
          This teammate does not exist or belongs to another account.
        </Text>
        <Button onPress={handleBack} variant="outline">
          <Button.Label>Back to teammates</Button.Label>
        </Button>
      </View>
    )
  }

  const agent = agentQuery.data

  return (
    <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
      <View className="flex-1 bg-background" style={{ paddingTop: insets.top }}>
        <View className="flex-row items-center gap-2 px-4 py-3">
          <Pressable
            accessibilityLabel="Back to teammates"
            accessibilityRole="button"
            className="p-2"
            onPress={handleBack}
          >
            <StyledIonicons
              className="text-foreground"
              name="chevron-back"
              size={22}
            />
          </Pressable>
          <View className="min-w-0 flex-1">
            <Text className="font-geist-semibold text-foreground text-medium">
              {agent.name}
            </Text>
            <Text className="text-caption text-muted-foreground">
              {agent.role}
            </Text>
          </View>
          {isEditing ? null : (
            <Button onPress={startEditing} size="sm" variant="ghost">
              <Button.Label>Edit</Button.Label>
            </Button>
          )}
        </View>
        <View className="bg-border" style={{ height: 1 }} />

        <KeyboardAwareScrollView
          contentContainerStyle={{ flexGrow: 1, padding: 24 }}
          keyboardShouldPersistTaps="handled"
          ref={scrollRef}
          style={{ flex: 1 }}
        >
          <View className="flex-1 gap-6">
            {isEditing ? (
              <EditAgentForm
                agent={agent}
                onCancel={stopEditing}
                onSaved={stopEditing}
              />
            ) : (
              <View className="gap-3">
                {agent.description ? (
                  <Text className="text-muted-foreground text-small">
                    {agent.description}
                  </Text>
                ) : null}
                {agent.instructions ? (
                  <View className="gap-1">
                    <Text className="text-caption text-muted-foreground">
                      Standing instructions
                    </Text>
                    <Text className="text-muted-foreground text-small">
                      {agent.instructions}
                    </Text>
                  </View>
                ) : null}
              </View>
            )}

            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center gap-2">
                <Text className="font-geist-semibold text-foreground text-medium">
                  Give {agentName} a task
                </Text>
                <Text className="text-center text-muted-foreground text-small">
                  Describe the outcome you want. Messages stay with this
                  teammate.
                </Text>
              </View>
            ) : (
              <View className="gap-2" testID="agent-messages">
                {messages.map((message) => (
                  <View key={message.id} style={{ alignItems: "flex-end" }}>
                    <View
                      className="bg-accent px-3 py-2"
                      style={{ maxWidth: "85%" }}
                    >
                      <Text className="font-geist-regular text-accent-foreground text-body">
                        {message.content}
                      </Text>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>
        </KeyboardAwareScrollView>

        <View className="bg-border" style={{ height: 1 }} />
        <View
          className="gap-2 px-4 py-3"
          style={{ paddingBottom: insets.bottom + 12 }}
        >
          <View className="flex-row items-center gap-2">
            <Input
              className="flex-1"
              onChangeText={handleContentChange}
              onSubmitEditing={handleSubmitEditing}
              placeholder={`Message ${agentName}...`}
              returnKeyType="send"
              value={content}
            />
            <Button
              isDisabled={!content.trim() || isSending}
              onPress={handleSendPress}
            >
              <Button.Label>{isSending ? "Sending..." : "Send"}</Button.Label>
            </Button>
          </View>
          {sendError ? (
            <Text className="text-caption text-destructive-foreground">
              {sendError.message}
            </Text>
          ) : null}
        </View>
      </View>
    </KeyboardAvoidingView>
  )
}
