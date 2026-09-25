import { queryOptions, useQuery } from '@tanstack/react-query'

import { ApiError, apiFetch } from '@/lib/api'
import { clearToken, getToken } from '@/lib/auth-token'
import { userSchema, type User } from '@/lib/schemas/auth'

export const authKeys = {
  currentUser: ['auth', 'currentUser'] as const,
}

export const currentUserQueryOptions = queryOptions({
  queryKey: authKeys.currentUser,
  queryFn: async (): Promise<User | null> => {
    if (!getToken()) return null

    try {
      return await apiFetch('/me', userSchema)
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
