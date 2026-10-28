import { Redirect, useRouter } from "expo-router"
import { Button, FieldError, Input, Label, TextField } from "heroui-native"
import { useCallback, useState } from "react"
import { Text, View } from "react-native"
import { KeyboardAwareScrollView } from "react-native-keyboard-controller"
import { authClient } from "@/lib/auth-client"

type AuthMode = "sign-in" | "sign-up"

interface FieldErrors {
  email?: string
  name?: string
  password?: string
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validateFields(
  mode: AuthMode,
  name: string,
  email: string,
  password: string
): FieldErrors {
  const errors: FieldErrors = {}

  if (mode === "sign-up" && !name.trim()) {
    errors.name = "Enter your name."
  }

  if (!email.trim()) {
    errors.email = "Enter your email address."
  } else if (!EMAIL_PATTERN.test(email)) {
    errors.email = "Enter a valid email address."
  }

  if (!password) {
    errors.password = "Enter your password."
  } else if (password.length < 8) {
    errors.password = "Use at least 8 characters."
  }

  return errors
}

function getSubmitLabel(isSignUp: boolean, isSubmitting: boolean): string {
  if (isSubmitting) {
    return isSignUp ? "Creating account..." : "Signing in..."
  }

  return isSignUp ? "Create account" : "Sign in"
}

export default function LoginScreen() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const isSignUp = mode === "sign-up"

  const handleNameChange = useCallback((value: string) => {
    setName(value)
    setFieldErrors((current) => ({ ...current, name: undefined }))
  }, [])

  const handleEmailChange = useCallback((value: string) => {
    setEmail(value)
    setFieldErrors((current) => ({ ...current, email: undefined }))
  }, [])

  const handlePasswordChange = useCallback((value: string) => {
    setPassword(value)
    setFieldErrors((current) => ({ ...current, password: undefined }))
  }, [])

  const handleToggleMode = useCallback(() => {
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
    setFieldErrors({})
    setSubmitError(null)
  }, [])

  const handleSubmit = useCallback(async () => {
    const nextErrors = validateFields(mode, name, email, password)
    setFieldErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) {
      return
    }

    setIsSubmitting(true)
    setSubmitError(null)

    try {
      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({
              email: email.trim(),
              name: name.trim(),
              password,
            })
          : await authClient.signIn.email({
              email: email.trim(),
              password,
            })

      if (result.error) {
        setSubmitError(result.error.message ?? "Something went wrong.")
        return
      }

      router.replace("/")
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Something went wrong."
      )
    } finally {
      setIsSubmitting(false)
    }
  }, [mode, name, email, password, router])

  if (isPending) {
    return <View className="flex-1 bg-background" />
  }

  if (session) {
    return <Redirect href="/" />
  }

  return (
    <View className="flex-1 bg-background">
      <KeyboardAwareScrollView
        bottomOffset={24}
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center gap-8 px-6 py-10">
          <View className="gap-2">
            <Text className="font-geist-medium text-compact text-muted-foreground">
              Quorl
            </Text>
            <Text className="font-geist-semibold text-foreground text-section">
              {isSignUp ? "Create your account" : "Sign in to Quorl"}
            </Text>
            <Text className="font-geist-regular text-body text-muted-foreground">
              {isSignUp
                ? "Start directing AI teammates that complete real work."
                : "Access your teammates and the work they are completing."}
            </Text>
          </View>

          <View className="gap-4">
            {isSignUp ? (
              <TextField isInvalid={Boolean(fieldErrors.name)}>
                <Label>Name</Label>
                <Input
                  autoComplete="name"
                  onChangeText={handleNameChange}
                  value={name}
                />
                {fieldErrors.name ? (
                  <FieldError>{fieldErrors.name}</FieldError>
                ) : null}
              </TextField>
            ) : null}

            <TextField isInvalid={Boolean(fieldErrors.email)}>
              <Label>Email</Label>
              <Input
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                keyboardType="email-address"
                onChangeText={handleEmailChange}
                value={email}
              />
              {fieldErrors.email ? (
                <FieldError>{fieldErrors.email}</FieldError>
              ) : null}
            </TextField>

            <TextField isInvalid={Boolean(fieldErrors.password)}>
              <Label>Password</Label>
              <Input
                autoCapitalize="none"
                autoComplete={isSignUp ? "new-password" : "current-password"}
                onChangeText={handlePasswordChange}
                secureTextEntry
                value={password}
              />
              {fieldErrors.password ? (
                <FieldError>{fieldErrors.password}</FieldError>
              ) : null}
            </TextField>
          </View>

          <View className="gap-3">
            {submitError ? (
              <Text className="font-geist-regular text-caption text-destructive-foreground">
                {submitError}
              </Text>
            ) : null}

            <Button
              className="w-full"
              isDisabled={isSubmitting}
              onPress={handleSubmit}
            >
              <Button.Label>
                {getSubmitLabel(isSignUp, isSubmitting)}
              </Button.Label>
            </Button>

            <Button
              className="self-start"
              onPress={handleToggleMode}
              size="sm"
              variant="ghost"
            >
              <Button.Label>
                {isSignUp
                  ? "Already have an account? Sign in"
                  : "New to Quorl? Create an account"}
              </Button.Label>
            </Button>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}
