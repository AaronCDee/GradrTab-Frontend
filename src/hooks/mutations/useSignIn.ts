import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch, withErrorMessages } from '@/lib/api'
import { authResponseSchema, type SignInValues } from '@/lib/schemas/auth'

export function useSignIn({ redirectTo = '/submissions' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async (values: SignInValues) => {
      return apiFetch('/login', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify(values),
      }).catch(withErrorMessages({ 401: "That email and password don't match. Try again." }))
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
