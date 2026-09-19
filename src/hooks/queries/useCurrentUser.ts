import { queryOptions, useQuery } from '@tanstack/react-query'

import { ApiError, apiFetch } from '@/lib/api'
import { clearToken, getToken } from '@/lib/auth-token'
import { currentUserResponseSchema, type User } from '@/lib/schemas/auth'

export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
}

export const currentUserQueryOptions = queryOptions({
  queryKey: authKeys.currentUser,
  queryFn: async (): Promise<User | null> => {
    if (!getToken()) return null

    try {
      const data = await apiFetch('/auth/me', currentUserResponseSchema)
      return data.user
    } catch (error) {
      if (error instanceof ApiError && error.status === 401) {
        clearToken()
        return null
      }
      throw error
    }
  },
  retry: false,
  staleTime: Infinity,
})

export const useCurrentUser = () => useQuery(currentUserQueryOptions)
