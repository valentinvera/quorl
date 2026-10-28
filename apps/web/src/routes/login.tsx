import { Button } from "@quorl/ui/components/button"
import { Input } from "@quorl/ui/components/input"
import { Label } from "@quorl/ui/components/label"
import { useForm, useStore } from "@tanstack/react-form"
import {
  createFileRoute,
  redirect,
  useNavigate,
  useRouter,
} from "@tanstack/react-router"
import { type ChangeEvent, type FormEvent, useCallback, useState } from "react"
import { authClient } from "@/lib/auth-client"
import { getCurrentSession } from "@/server/session"

export const Route = createFileRoute("/login")({
  beforeLoad: async () => {
    const session = await getCurrentSession()

    if (session) {
      throw redirect({ to: "/" })
    }
  },
  component: LoginPage,
})

type AuthMode = "sign-in" | "sign-up"

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function getSubmitLabel(isSignUp: boolean, isSubmitting: boolean): string {
  if (isSubmitting) {
    return isSignUp ? "Creating account..." : "Signing in..."
  }

  return isSignUp ? "Create account" : "Sign in"
}

function LoginPage() {
  const router = useRouter()
  const navigate = useNavigate()
  const [mode, setMode] = useState<AuthMode>("sign-in")
  const [submitError, setSubmitError] = useState<string | null>(null)

  const form = useForm({
    defaultValues: {
      email: "",
      name: "",
      password: "",
    },
    onSubmit: async ({ value }) => {
      setSubmitError(null)

      const result =
        mode === "sign-up"
          ? await authClient.signUp.email({
              email: value.email,
              name: value.name,
              password: value.password,
            })
          : await authClient.signIn.email({
              email: value.email,
              password: value.password,
            })

      if (result.error) {
        setSubmitError(result.error.message ?? "Something went wrong.")
        return
      }

      await router.invalidate()
      await navigate({ to: "/" })
    },
  })

  const canSubmit = useStore(form.store, (state) => state.canSubmit)
  const isSubmitting = useStore(form.store, (state) => state.isSubmitting)
  const isSignUp = mode === "sign-up"

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

  const handleEmailChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldValue("email", event.target.value)
    },
    [form]
  )

  const handlePasswordChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      form.setFieldValue("password", event.target.value)
    },
    [form]
  )

  const handleToggleMode = useCallback(() => {
    setMode((current) => (current === "sign-in" ? "sign-up" : "sign-in"))
    setSubmitError(null)
  }, [])

  return (
    <main className="grid min-h-svh place-items-center px-6 py-12">
      <div className="w-full max-w-sm">
        <p className="text-caption text-muted-foreground">Quorl</p>
        <h1 className="mt-6 font-medium text-section">
          {isSignUp ? "Create your account" : "Sign in to Quorl"}
        </h1>
        <p className="mt-2 text-body text-muted-foreground">
          {isSignUp
            ? "Start directing AI teammates that complete real work."
            : "Access your teammates and the work they are completing."}
        </p>

        <form
          className="mt-8 flex flex-col gap-5"
          noValidate
          onSubmit={handleSubmit}
        >
          {isSignUp ? (
            <form.Field
              name="name"
              validators={{
                onSubmit: ({ value }) =>
                  value.trim() ? undefined : "Enter your name.",
              }}
            >
              {(field) => (
                <div className="flex flex-col gap-2">
                  <Label htmlFor={field.name}>Name</Label>
                  <Input
                    aria-describedby={
                      field.state.meta.errors[0] ? "name-error" : undefined
                    }
                    aria-invalid={field.state.meta.errors.length > 0}
                    autoComplete="name"
                    id={field.name}
                    name={field.name}
                    onBlur={field.handleBlur}
                    onChange={handleNameChange}
                    value={field.state.value}
                  />
                  {field.state.meta.errors[0] ? (
                    <p
                      className="text-caption text-destructive-foreground"
                      id="name-error"
                    >
                      {field.state.meta.errors[0]}
                    </p>
                  ) : null}
                </div>
              )}
            </form.Field>
          ) : null}

          <form.Field
            name="email"
            validators={{
              onSubmit: ({ value }) => {
                if (!value.trim()) {
                  return "Enter your email address."
                }

                return EMAIL_PATTERN.test(value)
                  ? undefined
                  : "Enter a valid email address."
              },
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>Email</Label>
                <Input
                  aria-describedby={
                    field.state.meta.errors[0] ? "email-error" : undefined
                  }
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoComplete="email"
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={handleEmailChange}
                  type="email"
                  value={field.state.value}
                />
                {field.state.meta.errors[0] ? (
                  <p
                    className="text-caption text-destructive-foreground"
                    id="email-error"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          <form.Field
            name="password"
            validators={{
              onSubmit: ({ value }) => {
                if (!value) {
                  return "Enter your password."
                }

                return value.length >= 8
                  ? undefined
                  : "Use at least 8 characters."
              },
            }}
          >
            {(field) => (
              <div className="flex flex-col gap-2">
                <Label htmlFor={field.name}>Password</Label>
                <Input
                  aria-describedby={
                    field.state.meta.errors[0] ? "password-error" : undefined
                  }
                  aria-invalid={field.state.meta.errors.length > 0}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                  id={field.name}
                  name={field.name}
                  onBlur={field.handleBlur}
                  onChange={handlePasswordChange}
                  type="password"
                  value={field.state.value}
                />
                {field.state.meta.errors[0] ? (
                  <p
                    className="text-caption text-destructive-foreground"
                    id="password-error"
                  >
                    {field.state.meta.errors[0]}
                  </p>
                ) : null}
              </div>
            )}
          </form.Field>

          {submitError ? (
            <p className="text-destructive-foreground text-small" role="alert">
              {submitError}
            </p>
          ) : null}

          <Button
            className="mt-1 w-full"
            disabled={!(canSubmit && !isSubmitting)}
            size="lg"
            type="submit"
          >
            {getSubmitLabel(isSignUp, isSubmitting)}
          </Button>
        </form>

        <Button
          className="mt-6 px-0"
          onClick={handleToggleMode}
          size="sm"
          type="button"
          variant="link"
        >
          {isSignUp
            ? "Already have an account? Sign in"
            : "New to Quorl? Create an account"}
        </Button>
      </div>
    </main>
  )
}
