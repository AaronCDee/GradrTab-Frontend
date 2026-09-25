import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'
import { apiFetch } from '@/lib/api'
import { authResponseSchema, type SignInValues } from '@/lib/schemas/auth'

export function useSignIn({ redirectTo = '/dashboard' }: { redirectTo?: string } = {}) {
  const { startSession } = useAuthSession()

  return useMutation({
    mutationFn: async (values: SignInValues) => {
      return apiFetch('/login', authResponseSchema, {
        method: 'POST',
        body: JSON.stringify(values),
      })
    },
    onSuccess: (data) => startSession(data, redirectTo),
  })
}
