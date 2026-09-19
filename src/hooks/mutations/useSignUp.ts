import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch } from '@/lib/api'
import { authResponseSchema, type SignUpValues } from '@/lib/schemas/auth'

export function useSignUp({ redirectTo = '/' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async ({ firstName, lastName, email, password }: SignUpValues) => {
      const data = await apiFetch<unknown>('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ firstName, lastName, email, password }),
      })
      return authResponseSchema.parse(data)
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
