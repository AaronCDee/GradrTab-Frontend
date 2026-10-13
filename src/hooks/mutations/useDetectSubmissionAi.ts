import { useMutation } from '@tanstack/react-query'

import { detectSubmissionAi } from '@/lib/services/submissions'

export function useDetectSubmissionAi(id: string) {
  return useMutation({
    mutationFn: () => detectSubmissionAi(id),
  })
}
