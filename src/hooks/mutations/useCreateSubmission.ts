import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { createSubmission } from '@/lib/storage/submissions'

export function useCreateSubmission() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createSubmission,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: submissionKeys.all })
      await navigate({ to: '/submissions' })
    },
  })
}
