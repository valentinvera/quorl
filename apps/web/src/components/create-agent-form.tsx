import { Button } from "@quorl/ui/components/button"
import { Input } from "@quorl/ui/components/input"
import { Label } from "@quorl/ui/components/label"
import { Textarea } from "@quorl/ui/components/textarea"
import { useForm, useStore } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { type ChangeEvent, type FormEvent, useCallback } from "react"
import type { AgentTemplate } from "@/lib/agent-templates"
import { useTRPC } from "@/utils/trpc"

const DESCRIPTION_LIMIT = 280
const INSTRUCTIONS_LIMIT = 2000

interface CreateAgentFormProps {
  onCancel: () => void
  onCreated: () => void
  template?: AgentTemplate
}

export function CreateAgentForm({
  onCancel,
  onCreated,
  template,
}: CreateAgentFormProps) {
  const trpc = useTRPC()
  const queryClient = useQueryClient()

  const createAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())
        onCreated()
      },
    })
  )
  const { error, isPending, mutate } = createAgent

  const form = useForm({
    defaultValues: {
      description: template?.description ?? "",
      instructions: template?.instructions ?? "",
      name: "",
      role: template?.role ?? "",
    },
    onSubmit: ({ value }) => {
      mutate({
        description: value.description.trim() || undefined,
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
      className="border border-border p-4"
      noValidate
      onSubmit={handleSubmit}
    >
      {template ? (
        <p className="mb-4 text-caption text-muted-foreground">
          From template: {template.role}
        </p>
      ) : null}

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
              <Label htmlFor={field.name}>Name</Label>
              <Input
                aria-describedby={
                  field.state.meta.errors[0] ? "agent-name-error" : undefined
                }
                aria-invalid={field.state.meta.errors.length > 0}
                autoComplete="off"
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={handleNameChange}
                placeholder="Atlas"
                value={field.state.value}
              />
              {field.state.meta.errors[0] ? (
                <p
                  className="text-caption text-destructive-foreground"
                  id="agent-name-error"
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
              <Label htmlFor={field.name}>Role</Label>
              <Input
                aria-describedby={
                  field.state.meta.errors[0] ? "agent-role-error" : undefined
                }
                aria-invalid={field.state.meta.errors.length > 0}
                autoComplete="off"
                id={field.name}
                name={field.name}
                onBlur={field.handleBlur}
                onChange={handleRoleChange}
                placeholder="Research analyst"
                value={field.state.value}
              />
              {field.state.meta.errors[0] ? (
                <p
                  className="text-caption text-destructive-foreground"
                  id="agent-role-error"
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
          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor={field.name}>Description</Label>
            <Textarea
              aria-describedby={
                field.state.meta.errors[0]
                  ? "agent-description-error"
                  : undefined
              }
              aria-invalid={field.state.meta.errors.length > 0}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={handleDescriptionChange}
              placeholder="Finds sources and prepares the weekly research brief."
              value={field.state.value}
            />
            {field.state.meta.errors[0] ? (
              <p
                className="text-caption text-destructive-foreground"
                id="agent-description-error"
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
          <div className="mt-4 flex flex-col gap-2">
            <Label htmlFor={field.name}>Instructions</Label>
            <Textarea
              aria-describedby={
                field.state.meta.errors[0]
                  ? "agent-instructions-error"
                  : undefined
              }
              aria-invalid={field.state.meta.errors.length > 0}
              id={field.name}
              name={field.name}
              onBlur={field.handleBlur}
              onChange={handleInstructionsChange}
              placeholder="Always cite sources and keep briefs under one page."
              value={field.state.value}
            />
            {field.state.meta.errors[0] ? (
              <p
                className="text-caption text-destructive-foreground"
                id="agent-instructions-error"
              >
                {field.state.meta.errors[0]}
              </p>
            ) : null}
          </div>
        )}
      </form.Field>

      {error ? (
        <p className="mt-4 text-destructive-foreground text-small" role="alert">
          {error.message}
        </p>
      ) : null}

      <div className="mt-5 flex items-center justify-end gap-2">
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
          {isPending ? "Creating..." : "Create teammate"}
        </Button>
      </div>
    </form>
  )
}
