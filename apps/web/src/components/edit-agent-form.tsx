import { Button } from "@quorl/ui/components/button"
import { Input } from "@quorl/ui/components/input"
import { Label } from "@quorl/ui/components/label"
import { Textarea } from "@quorl/ui/components/textarea"
import { useForm, useStore } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type ChangeEvent, type FormEvent, useCallback } from "react"
import { useTRPC } from "@/utils/trpc"

const DESCRIPTION_LIMIT = 280
const INSTRUCTIONS_LIMIT = 2000

interface EditableAgent {
  description: string | null
  id: string
  instructions: string | null
  name: string
  role: string
}

interface EditAgentFormProps {
  agent: EditableAgent
  onCancel: () => void
  onSaved: () => void
}

export function EditAgentForm({
  agent,
  onCancel,
  onSaved,
}: EditAgentFormProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const updateAgent = useMutation(
    trpc.agent.update.mutationOptions({
      onSuccess: async () => {
        await Promise.all([
          queryClient.invalidateQueries(trpc.agent.get.queryFilter()),
          queryClient.invalidateQueries(trpc.agent.list.queryFilter()),
        ])
        onSaved()
      },
    })
  )
  const { error, isPending, mutate } = updateAgent

  const form = useForm({
    defaultValues: {
      description: agent.description ?? "",
      instructions: agent.instructions ?? "",
      name: agent.name,
      role: agent.role,
    },
    onSubmit: ({ value }) => {
      mutate({
        description: value.description.trim() || undefined,
        id: agent.id,
        instructions: value.instructions.trim() || undefined,
        name: value.name,
        role: value.role,
      })
    },
  })

  const canSubmit = useStore(form.store, (state) => state.canSubmit)
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)

  const handleSubmit = useCallback(
    (event: FormEvent<HTMLFormElement>) => {
      event.preventDefault()
      event.stopPropagation()
      form.handleSubmit()
    },
    [form]
  )

  const handleNameChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldValue("name", event.target.value)
    },
    [form]
  )

  const handleRoleChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldValue("role", event.target.value)
    },
    [form]
  )

  const handleDescriptionChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      form.setFieldValue("description", event.target.value)
    },
    [form]
  )

  const handleInstructionsChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      form.setFieldValue("instructions", event.target.value)
    },
    [form]
  )

  return (
    <form
      className="mt-4 flex flex-col gap-4 border border-border p-4"
      noValidate
      onSubmit={handleSubmit}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        <form.Field
          name="name"
          validators={{
            onSubmit: ({ value }) => {
              if (!value.trim()) {
                return "Enter a name."
              }

              return value.length <= 80
                ? undefined
                : "Use 80 characters or fewer."
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-agent-name">Name</Label>
              <Input
                aria-describedby={
                  field.state.meta.errors[0]
                    ? "edit-agent-name-error"
                    : undefined
                }
                aria-invalid={field.state.meta.errors.length > 0}
                autoComplete="off"
                id="edit-agent-name"
                name={field.name}
                onBlur={field.handleBlur}
                onChange={handleNameChange}
                value={field.state.value}
              />
              {field.state.meta.errors[0] ? (
                <p
                  className="text-caption text-destructive-foreground"
                  id="edit-agent-name-error"
                >
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>

        <form.Field
          name="role"
          validators={{
            onSubmit: ({ value }) => {
              if (!value.trim()) {
                return "Enter a role."
              }

              return value.length <= 80
                ? undefined
                : "Use 80 characters or fewer."
            },
          }}
        >
          {(field) => (
            <div className="flex flex-col gap-2">
              <Label htmlFor="edit-agent-role">Role</Label>
              <Input
                aria-describedby={
                  field.state.meta.errors[0]
                    ? "edit-agent-role-error"
                    : undefined
                }
                aria-invalid={field.state.meta.errors.length > 0}
                autoComplete="off"
                id="edit-agent-role"
                name={field.name}
                onBlur={field.handleBlur}
                onChange={handleRoleChange}
                value={field.state.value}
              />
              {field.state.meta.errors[0] ? (
                <p
                  className="text-caption text-destructive-foreground"
                  id="edit-agent-role-error"
                >
                  {field.state.meta.errors[0]}
                </p>
              ) : null}
            </div>
          )}
        </form.Field>
      </div>

      <form.Field
        name="description"
        validators={{
          onSubmit: ({ value }) =>
            value.length <= DESCRIPTION_LIMIT
              ? undefined
              : `Use ${DESCRIPTION_LIMIT} characters or fewer.`,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-agent-description">Description</Label>
            <Textarea
              aria-describedby={
                field.state.meta.errors[0]
                  ? "edit-agent-description-error"
                  : undefined
              }
              aria-invalid={field.state.meta.errors.length > 0}
              id="edit-agent-description"
              name={field.name}
              onBlur={field.handleBlur}
              onChange={handleDescriptionChange}
              value={field.state.value}
            />
            {field.state.meta.errors[0] ? (
              <p
                className="text-caption text-destructive-foreground"
                id="edit-agent-description-error"
              >
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      <form.Field
        name="instructions"
        validators={{
          onSubmit: ({ value }) =>
            value.length <= INSTRUCTIONS_LIMIT
              ? undefined
              : `Use ${INSTRUCTIONS_LIMIT} characters or fewer.`,
        }}
      >
        {(field) => (
          <div className="flex flex-col gap-2">
            <Label htmlFor="edit-agent-instructions">Instructions</Label>
            <Textarea
              aria-describedby={
                field.state.meta.errors[0]
                  ? "edit-agent-instructions-error"
                  : undefined
              }
              aria-invalid={field.state.meta.errors.length > 0}
              id="edit-agent-instructions"
              name={field.name}
              onBlur={field.handleBlur}
              onChange={handleInstructionsChange}
              value={field.state.value}
            />
            {field.state.meta.errors[0] ? (
              <p
                className="text-caption text-destructive-foreground"
                id="edit-agent-instructions-error"
              >
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {error ? (
        <p className="text-destructive-foreground text-small" role="alert">
          {error.message}
        </p>
      ) : null}

      <div className="flex items-center justify-end gap-2">
        <Button
          disabled={isPending}
          onClick={onCancel}
          size="sm"
          type="button"
          variant="ghost"
        >
          Cancel
        </Button>
        <Button
          disabled={!(canSubmit && !isSubmitting && !isPending)}
          size="sm"
          type="submit"
        >
          {isPending ? "Saving..." : "Save changes"}
        </Button>
      </div>
    </form>
  )
}
