import { Ionicons } from "@expo/vector-icons"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "expo-router"
import { Button, Input } from "heroui-native"
import {
  Fragment,
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
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

const messageTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
})

function formatMessageTime(value: string): string {
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? "" : messageTimeFormatter.format(date)
}

const DAY_IN_MS = 86_400_000

function getStartOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
}

function getDayKey(value: string): string {
  const date = new Date(value)

  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`
}

function formatDayLabel(value: string): string {
  const date = new Date(value)
  const today = getStartOfDay(new Date())
  const target = getStartOfDay(date)
  const difference = Math.round(
    (today.getTime() - target.getTime()) / DAY_IN_MS
  )

  if (difference === 0) {
    return "Today"
  }

  if (difference === 1) {
    return "Yesterday"
  }

  return new Intl.DateTimeFormat(undefined, {
    day: "numeric",
    month: "short",
  }).format(date)
}

interface AgentConversationProps {
  agentId: string
}

interface AgentProfileViewProps {
  agent: {
    description: string | null
    instructions: string | null
    name: string
  }
  onDelete: () => void
}

function AgentProfileView({ agent, onDelete }: AgentProfileViewProps) {
  return (
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
      <Button onPress={onDelete} size="sm" variant="ghost">
        <Button.Label className="text-destructive-foreground">
          Delete teammate
        </Button.Label>
      </Button>
    </View>
  )
}

interface DeleteAgentPanelProps {
  error: string | null
  isPending: boolean
  name: string
  onCancel: () => void
  onConfirm: () => void
}

function DeleteAgentPanel({
  error,
  isPending,
  name,
  onCancel,
  onConfirm,
}: DeleteAgentPanelProps) {
  return (
    <View className="gap-3 border border-border p-4">
      <Text className="font-geist-semibold text-foreground text-medium">
        Delete {name}?
      </Text>
      <Text className="text-muted-foreground text-small">
        This removes the teammate and its messages. This cannot be undone.
      </Text>
      {error ? (
        <Text className="text-caption text-destructive-foreground">
          {error}
        </Text>
      ) : null}
      <View className="gap-2">
        <Button isDisabled={isPending} onPress={onConfirm} variant="outline">
          <Button.Label className="text-destructive-foreground">
            {isPending ? "Deleting..." : "Delete teammate"}
          </Button.Label>
        </Button>
        <Button isDisabled={isPending} onPress={onCancel} variant="ghost">
          <Button.Label>Cancel</Button.Label>
        </Button>
      </View>
    </View>
  )
}

interface MessageItem {
  content: string
  createdAt: string
  id: string
}

interface AgentMessageListProps {
  agentName: string
  messages: MessageItem[]
}

function AgentMessageList({ agentName, messages }: AgentMessageListProps) {
  if (messages.length === 0) {
    return (
      <View className="flex-1 items-center justify-center gap-2">
        <Text className="font-geist-semibold text-foreground text-medium">
          Give {agentName} a task
        </Text>
        <Text className="text-center text-muted-foreground text-small">
          Describe the outcome you want. Messages stay with this teammate.
        </Text>
      </View>
    )
  }

  return (
    <View className="gap-2" testID="agent-messages">
      {messages.map((message, index) => {
        const previousMessage = messages[index - 1]
        const showDaySeparator =
          !previousMessage ||
          getDayKey(previousMessage.createdAt) !== getDayKey(message.createdAt)

        return (
          <Fragment key={message.id}>
            {showDaySeparator ? (
              <View className="flex-row items-center gap-2 py-2">
                <View className="flex-1 bg-border" style={{ height: 1 }} />
                <Text className="text-caption text-muted-foreground">
                  {formatDayLabel(message.createdAt)}
                </Text>
                <View className="flex-1 bg-border" style={{ height: 1 }} />
              </View>
            ) : null}
            <View className="gap-1" style={{ alignItems: "flex-end" }}>
              <View className="bg-accent px-3 py-2" style={{ maxWidth: "85%" }}>
                <Text className="font-geist-regular text-accent-foreground text-body">
                  {message.content}
                </Text>
              </View>
              <Text className="text-caption text-muted-foreground">
                {formatMessageTime(message.createdAt)}
              </Text>
            </View>
          </Fragment>
        )
      })}
    </View>
  )
}

export function AgentConversation({ agentId }: AgentConversationProps) {
  const router = useRouter()
  const insets = useSafeAreaInsets()
  const queryClient = useQueryClient()
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
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

  const deleteAgent = useMutation(
    trpc.agent.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())

        if (router.canGoBack()) {
          router.back()
          return
        }

        router.replace("/")
      },
    })
  )
  const {
    error: deleteError,
    isPending: isDeletingPending,
    mutate: deleteAgentMutation,
  } = deleteAgent

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

  const startEditing = useCallback(() => {
    setIsDeleting(false)
    setIsEditing(true)
  }, [])
  const stopEditing = useCallback(() => setIsEditing(false), [])
  const startDeleting = useCallback(() => {
    setIsEditing(false)
    setIsDeleting(true)
  }, [])
  const stopDeleting = useCallback(() => setIsDeleting(false), [])
  const confirmDelete = useCallback(() => {
    deleteAgentMutation({ id: agentId })
  }, [agentId, deleteAgentMutation])

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

  let profileBlock: ReactNode

  if (isEditing) {
    profileBlock = (
      <EditAgentForm
        agent={agent}
        onCancel={stopEditing}
        onSaved={stopEditing}
      />
    )
  } else if (isDeleting) {
    profileBlock = (
      <DeleteAgentPanel
        error={deleteError?.message ?? null}
        isPending={isDeletingPending}
        name={agent.name}
        onCancel={stopDeleting}
        onConfirm={confirmDelete}
      />
    )
  } else {
    profileBlock = <AgentProfileView agent={agent} onDelete={startDeleting} />
  }

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
          {isEditing || isDeleting ? null : (
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
            {profileBlock}

            <AgentMessageList agentName={agentName} messages={messages} />
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
