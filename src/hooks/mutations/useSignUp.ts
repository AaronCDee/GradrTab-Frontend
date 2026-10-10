import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch, withErrorMessages } from '@/lib/api'
import { authResponseSchema, type SignUpValues } from '@/lib/schemas/auth'

export function useSignUp({ redirectTo = '/submissions' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: SignUpValues) => {
      return apiFetch('/register', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      }).catch(
        withErrorMessages({
          400: "We couldn't create your account. That email may already be in use.",
        }),
      )
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
