import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { documentKeys } from '@/hooks/queries/useDocuments'
import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { createSubmission } from '@/lib/services/submissions'

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createSubmission,
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
        queryClient.invalidateQueries({ queryKey: documentKeys.all }),
      ])
      await navigate({ to: '/submissions' })
    },
  })
}
