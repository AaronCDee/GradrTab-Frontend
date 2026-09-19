import { zodResolver } from '@hookform/resolvers/zod'
import { createFileRoute, Link, redirect } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { AuthCard } from '@/components/auth/AuthCard'
import { Button } from '@/components/ui/button'
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useSignUp } from '@/hooks/mutations/useSignUp'
import { currentUserQueryOptions } from '@/hooks/queries/useCurrentUser'
import { signUpSchema, type SignUpValues } from '@/lib/schemas/auth'

const SignUpPage = () => {
  const signUp = useSignUp()

  const form = useForm<SignUpValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { firstName: '', lastName: '', email: '', password: '', confirmPassword: '' },
  })

  const { errors } = form.formState

  return (
    <AuthCard
      title="Create an account"
      description="Sign up to start using GradrTab."
      footer={
        <>
          Already have an account?{' '}
          <Link to="/sign-in" className="text-foreground underline underline-offset-4">
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={form.handleSubmit((values) => signUp.mutate(values))} noValidate>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="name">First Name</FieldLabel>
            <Input
              id="firstName"
              autoComplete="firstName"
              aria-invalid={Boolean(errors.firstName)}
              {...form.register('firstName')}
            />
            <FieldError errors={[errors.firstName]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="lastName">Last Name</FieldLabel>
            <Input
              id="lastName"
              autoComplete="lastName"
              aria-invalid={Boolean(errors.lastName)}
              {...form.register('lastName')}
            />
            <FieldError errors={[errors.lastName]} />
          </Field>

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
              autoComplete="new-password"
              aria-invalid={Boolean(errors.password)}
              {...form.register('password')}
            />
            <FieldError errors={[errors.password]} />
          </Field>

          <Field>
            <FieldLabel htmlFor="confirmPassword">Confirm password</FieldLabel>
            <Input
              id="confirmPassword"
              type="password"
              autoComplete="new-password"
              aria-invalid={Boolean(errors.confirmPassword)}
              {...form.register('confirmPassword')}
            />
            <FieldError errors={[errors.confirmPassword]} />
          </Field>

          {signUp.error ? (
            <p role="alert" className="text-sm text-destructive">
              {signUp.error.message}
            </p>
          ) : null}

          <Button type="submit" disabled={signUp.isPending}>
            {signUp.isPending ? 'Creating account...' : 'Create account'}
          </Button>
        </FieldGroup>
      </form>
    </AuthCard>
  )
}

export const Route = createFileRoute('/sign-up')({
  beforeLoad: async ({ context }) => {
    const user = await context.queryClient.ensureQueryData(currentUserQueryOptions)
    if (user) throw redirect({ to: '/' })
  },
  component: SignUpPage,
})
