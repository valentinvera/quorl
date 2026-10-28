import { useMutation, useQueryClient } from "@tanstack/react-query"
import { Button, FieldError, Input, Label, TextField } from "heroui-native"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import { trpc } from "@/utils/trpc"

const DESCRIPTION_LIMIT = 280
const INSTRUCTIONS_LIMIT = 2000

interface CreateAgentFormProps {
  onCancel: () => void
  onCreated: () => void
}

interface FieldErrors {
  description?: string
  instructions?: string
  name?: string
  role?: string
}

function validateFields(
  name: string,
  role: string,
  description: string,
  instructions: string
): FieldErrors {
  const errors: FieldErrors = {}

  if (!name.trim()) {
    errors.name = "Enter a name."
  } else if (name.length > 80) {
    errors.name = "Use 80 characters or fewer."
  }

  if (!role.trim()) {
    errors.role = "Enter a role."
  } else if (role.length > 80) {
    errors.role = "Use 80 characters or fewer."
  }

  if (description.length > DESCRIPTION_LIMIT) {
    errors.description = `Use ${DESCRIPTION_LIMIT} characters or fewer.`
  }

  if (instructions.length > INSTRUCTIONS_LIMIT) {
    errors.instructions = `Use ${INSTRUCTIONS_LIMIT} characters or fewer.`
  }

  return errors
}

export function CreateAgentForm({ onCancel, onCreated }: CreateAgentFormProps) {
  const queryClient = useQueryClient()
  const [name, setName] = useState("")
  const [role, setRole] = useState("")
  const [description, setDescription] = useState("")
  const [instructions, setInstructions] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})

  const createAgent = useMutation(
    trpc.agent.create.mutationOptions({
      onSuccess: async () => {
        await queryClient.invalidateQueries(trpc.agent.list.queryFilter())
        onCreated()
      },
    })
  )
  const { error, isPending, mutate } = createAgent

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    setFieldErrors((current) => ({ ...current, name: undefined }))
  }, [])

  const handleRoleChange = useCallback((value: string) => {
    setRole(value)
    setFieldErrors((current) => ({ ...current, role: undefined }))
  }, [])

  const handleDescriptionChange = useCallback((value: string) => {
    setDescription(value)
    setFieldErrors((current) => ({ ...current, description: undefined }))
  }, [])

  const handleInstructionsChange = useCallback((value: string) => {
    setInstructions(value)
    setFieldErrors((current) => ({ ...current, instructions: undefined }))
  }, [])

  const handleSubmit = useCallback(() => {
    const nextErrors = validateFields(name, role, description, instructions)
    setFieldErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    mutate({
      description: description.trim() || undefined,
      instructions: instructions.trim() || undefined,
      name: name.trim(),
      role: role.trim(),
    })
  }, [name, role, description, instructions, mutate])

  return (
    <View className="gap-4 border border-border p-4">
      <TextField isInvalid={Boolean(fieldErrors.name)}>
        <Label>Name</Label>
        <Input
          autoCapitalize="words"
          autoComplete="off"
          onChangeText={handleNameChange}
          value={name}
        />
        {fieldErrors.name ? <FieldError>{fieldErrors.name}</FieldError> : null}
      </TextField>

      <TextField isInvalid={Boolean(fieldErrors.role)}>
        <Label>Role</Label>
        <Input
          autoCapitalize="sentences"
          autoComplete="off"
          onChangeText={handleRoleChange}
          value={role}
        />
        {fieldErrors.role ? <FieldError>{fieldErrors.role}</FieldError> : null}
      </TextField>

      <TextField isInvalid={Boolean(fieldErrors.description)}>
        <Label>Description</Label>
        <Input
          autoCapitalize="sentences"
          multiline
          numberOfLines={3}
          onChangeText={handleDescriptionChange}
          value={description}
        />
        {fieldErrors.description ? (
          <FieldError>{fieldErrors.description}</FieldError>
        ) : null}
      </TextField>

      <TextField isInvalid={Boolean(fieldErrors.instructions)}>
        <Label>Instructions</Label>
        <Input
          autoCapitalize="sentences"
          multiline
          numberOfLines={4}
          onChangeText={handleInstructionsChange}
          value={instructions}
        />
        {fieldErrors.instructions ? (
          <FieldError>{fieldErrors.instructions}</FieldError>
        ) : null}
      </TextField>

      {error ? (
        <Text className="font-geist-regular text-caption text-destructive-foreground">
          {error.message}
        </Text>
      ) : null}

      <View className="gap-2">
        <Button isDisabled={isPending} onPress={handleSubmit}>
          <Button.Label>
            {isPending ? "Creating..." : "Create teammate"}
          </Button.Label>
        </Button>
        <Button isDisabled={isPending} onPress={onCancel} variant="ghost">
          <Button.Label>Cancel</Button.Label>
        </Button>
      </View>
    </View>
  )
}
