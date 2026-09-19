import { useMutation } from '@tanstack/react-query'

import { useAuthSession } from '@/hooks/useAuthSession'

export function useSignOut() {
  const { endSession } = useAuthSession()

  return useMutation({
    mutationFn: endSession,
  })
}
