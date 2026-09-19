import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, useRouter } from '@tanstack/react-router'

import { authKeys } from '@/hooks/queries/useCurrentUser'
import { clearToken, setToken } from '@/lib/auth-token'
import type { AuthResponse } from '@/lib/schemas/auth'

export function useAuthSession() {
  const queryClient = useQueryClient()
  const router = useRouter()
  const navigate = useNavigate()

  const startSession = async ({ token, user }: AuthResponse, redirectTo: string) => {
    setToken(token)
    queryClient.setQueryData(authKeys.currentUser, user)
    await router.invalidate()
    await navigate({ to: redirectTo })
  }

  const endSession = async () => {
    clearToken()
    queryClient.clear()
    queryClient.setQueryData(authKeys.currentUser, null)
    await router.invalidate()
    await navigate({ to: '/sign-in' })
  }

  return { startSession, endSession }
}
