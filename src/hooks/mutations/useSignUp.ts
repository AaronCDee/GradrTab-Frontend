import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch } from '@/lib/api'
import { authResponseSchema, type SignUpValues } from '@/lib/schemas/auth'

export function useSignUp({ redirectTo = '/dashboard' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: SignUpValues) => {
      return apiFetch('/register', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
