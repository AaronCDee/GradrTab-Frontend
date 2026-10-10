import { useMutation, useQueryClient } from '@tanstack/react-query'

import { documentKeys } from '@/hooks/queries/useDocuments'
import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { deleteSubmission } from '@/lib/services/submissions'

export function useDeleteSubmission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: deleteSubmission,
    onSuccess: () =>
      Promise.all([
        queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
        queryClient.invalidateQueries({ queryKey: documentKeys.all }),
      ]),
  })
}
