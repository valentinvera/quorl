import { Bubble, BubbleContent } from "@quorl/ui/components/bubble"
import { Button } from "@quorl/ui/components/button"
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@quorl/ui/components/empty"
import { Message, MessageContent } from "@quorl/ui/components/message"
import { Textarea } from "@quorl/ui/components/textarea"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { Link, useNavigate } from "@tanstack/react-router"
import { ArrowLeftIcon, SendIcon } from "lucide-react"
import {
  type ChangeEvent,
  type FormEvent,
  type KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react"
import { EditAgentForm } from "@/components/edit-agent-form"
import { useTRPC } from "@/utils/trpc"

const MAX_MESSAGE_LENGTH = 4000

const messageTimeFormatter = new Intl.DateTimeFormat(undefined, {
  hour: "numeric",
  minute: "2-digit",
})

function formatMessageTime(value: string): string {
  const date = new Date(value)

  return Number.isNaN(date.getTime()) ? "" : messageTimeFormatter.format(date)
}

interface AgentConversationProps {
  agentId: string
}

export function AgentConversation({ agentId }: AgentConversationProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const [content, setContent] = useState("")
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)

  const agentQuery = useQuery(trpc.agent.get.queryOptions({ id: agentId }))
  const messagesQuery = useQuery(trpc.message.list.queryOptions({ agentId }))

  const deleteAgent = useMutation(
    trpc.agent.delete.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())
        await navigate({ to: "/" })
      },
    })
  )
  const {
    error: deleteError,
    isPending: isDeletingPending,
    mutate: deleteAgentMutation,
  } = deleteAgent

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

    messagesEndRef.current?.scrollIntoView({ block: "end" })
  }, [messages.length])

  const handleContentChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      setContent(event.target.value)
    },
    []
  )

  const submitMessage = useCallback(() => {
    const trimmed = content.trim()

    if (!trimmed || isSending) {
      return
    }

    sendMessageMutation({ agentId, content: trimmed })
  }, [agentId, content, isSending, sendMessageMutation])

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      submitMessage()
    },
    [submitMessage]
  )

  const handleComposerKeyDown = useCallback(
    (event: KeyboardEvent<HTMLTextAreaElement>) => {
      if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
        event.preventDefault()
        submitMessage()
      }
    },
    [submitMessage]
  )

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
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-destructive-foreground text-small" role="alert">
          Could not load teammate: {agentQuery.error.message}
        </p>
        <Link
          className="mt-6 inline-flex text-small underline underline-offset-4"
          to="/"
        >
          Back to teammates
        </Link>
      </div>
    )
  }

  if (agentQuery.data === undefined) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <p className="text-muted-foreground text-small">Loading teammate...</p>
      </div>
    )
  }

  if (agentQuery.data === null) {
    return (
      <div className="mx-auto w-full max-w-3xl px-6 py-10">
        <h1 className="font-medium text-section">Teammate not found</h1>
        <p className="mt-2 text-body text-muted-foreground">
          This teammate does not exist or belongs to another account.
        </p>
        <Link
          className="mt-6 inline-flex text-small underline underline-offset-4"
          to="/"
        >
          Back to teammates
        </Link>
      </div>
    )
  }

  const agent = agentQuery.data

  return (
    <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col">
      <div className="px-6 py-5">
        <Link
          className="inline-flex items-center gap-1.5 text-caption text-muted-foreground hover:text-foreground"
          to="/"
        >
          <ArrowLeftIcon className="size-3.5" />
          Teammates
        </Link>
        <div className="mt-3 flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h1 className="font-medium text-section">{agent.name}</h1>
            <p className="mt-1 text-muted-foreground text-small">
              {agent.role}
            </p>
            {agent.description ? (
              <p className="mt-2 text-body text-muted-foreground">
                {agent.description}
              </p>
            ) : null}
            {agent.instructions ? (
              <div className="mt-4">
                <p className="text-caption text-muted-foreground">
                  Standing instructions
                </p>
                <p className="mt-1 whitespace-pre-wrap text-body text-muted-foreground">
                  {agent.instructions}
                </p>
              </div>
            ) : null}
          </div>
          {isEditing || isDeleting ? null : (
            <div className="flex items-center gap-2">
              <Button
                onClick={startEditing}
                size="sm"
                type="button"
                variant="outline"
              >
                Edit
              </Button>
              <Button
                className="text-destructive-foreground"
                onClick={startDeleting}
                size="sm"
                type="button"
                variant="ghost"
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        {isEditing ? (
          <EditAgentForm
            agent={agent}
            onCancel={stopEditing}
            onSaved={stopEditing}
          />
        ) : null}
        {isDeleting ? (
          <div className="mt-4 border border-destructive/40 p-4">
            <p className="font-medium text-medium">Delete {agent.name}?</p>
            <p className="mt-1 text-muted-foreground text-small">
              This removes the teammate and its messages. This cannot be undone.
            </p>
            {deleteError ? (
              <p
                className="mt-2 text-destructive-foreground text-small"
                role="alert"
              >
                {deleteError.message}
              </p>
            ) : null}
            <div className="mt-4 flex items-center justify-end gap-2">
              <Button
                disabled={isDeletingPending}
                onClick={stopDeleting}
                size="sm"
                type="button"
                variant="ghost"
              >
                Cancel
              </Button>
              <Button
                className="text-destructive-foreground"
                disabled={isDeletingPending}
                onClick={confirmDelete}
                size="sm"
                type="button"
                variant="destructive"
              >
                {isDeletingPending ? "Deleting..." : "Delete teammate"}
              </Button>
            </div>
          </div>
        ) : null}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto px-6 pb-6">
        {messages.length === 0 ? (
          <Empty className="py-16">
            <EmptyHeader>
              <EmptyTitle>Give {agentName} a task</EmptyTitle>
              <EmptyDescription>
                Describe the outcome you want. Messages stay with this teammate.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        ) : (
          <div className="flex flex-col gap-3">
            {messages.map((message) => (
              <Message align="end" key={message.id}>
                <MessageContent>
                  <Bubble align="end">
                    <BubbleContent className="whitespace-pre-wrap">
                      {message.content}
                    </BubbleContent>
                  </Bubble>
                  <time
                    className="self-end text-caption text-muted-foreground"
                    dateTime={message.createdAt}
                  >
                    {formatMessageTime(message.createdAt)}
                  </time>
                </MessageContent>
              </Message>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <form className="border-border border-t" onSubmit={handleSubmit}>
        <div className="px-6 py-4">
          <div className="flex items-end gap-2">
            <Textarea
              aria-label={`Message ${agentName}`}
              className="max-h-40 min-h-10 flex-1"
              disabled={isSending}
              maxLength={MAX_MESSAGE_LENGTH}
              onChange={handleContentChange}
              onKeyDown={handleComposerKeyDown}
              placeholder={`Message ${agentName}...`}
              value={content}
            />
            <Button
              aria-label="Send message"
              disabled={!content.trim() || isSending}
              size="icon"
              type="submit"
            >
              <SendIcon className="size-4" />
            </Button>
          </div>
          {sendError ? (
            <p
              className="mt-2 text-destructive-foreground text-small"
              role="alert"
            >
              {sendError.message}
            </p>
          ) : null}
          <p className="mt-2 hidden text-caption text-muted-foreground sm:block">
            Cmd/Ctrl + Enter to send
          </p>
        </div>
      </form>
    </div>
  )
}
