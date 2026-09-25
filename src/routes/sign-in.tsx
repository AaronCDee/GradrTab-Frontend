import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSignIn } from '@/hooks/mutations/useSignIn'
import { currentUserQueryOptions } from '@/hooks/queries/useCurrentUser'
import { signInSchema, type SignInValues } from '@/lib/schemas/auth'

const searchSchema = z.object({
  redirect: z.string().optional(),
})

const SignInPage = () => {
  const { redirect: redirectTo } = Route.useSearch()
  const signIn = useSignIn({ redirectTo: redirectTo || '/dashboard' })

  const form = useForm<SignInValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '' },
  })

  const { errors } = form.formState

  return (
    <AuthCard
      title="Sign in"
      description="Enter your credentials to access your account."
      footer={
        <>
          Don&apos;t have an account?{' '}
          <Link to="/sign-up" className="text-foreground underline underline-offset-4">
            Sign up
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit((values) => signIn.mutate(values))} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input
              id="email"
              type="email"
              autoComplete="email"
              aria-invalid={Boolean(errors.email)}
              {...form.register('email')}
            />
            <FieldError errors={[errors.email]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="password">Password</FieldLabel>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              aria-invalid={Boolean(errors.password)}
              {...form.register('password')}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          {signIn.error ? (
            <p role="alert" className="text-sm text-destructive">
              {signIn.error.message}
            </p>
          ) : null}

          <Button type="submit" disabled={signIn.isPending}>
            {signIn.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}

export const Route = createFileRoute('/sign-in')({
  validateSearch: searchSchema,
  beforeLoad: async ({ context, search }) => {
    const user = await context.queryClient.ensureQueryData(currentUserQueryOptions)
    if (user) throw redirect({ to: search.redirect || '/dashboard' })
  },
  component: SignInPage,
})
