import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch } from '@/lib/api'
import { authResponseSchema, type SignInValues } from '@/lib/schemas/auth'

export function useSignIn({ redirectTo = '/' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async (values: SignInValues) => {
      const data = await apiFetch<unknown>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(values),
      })
      return authResponseSchema.parse(data)
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
