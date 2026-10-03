import { useMutation, useQueryClient } from '@tanstack/react-query'

import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { deleteSubmission } from '@/lib/storage/submissions'

export function useDeleteSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
  })
}
