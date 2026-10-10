import { useMutation, useQueryClient } from '@tanstack/react-query'

import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { gradeSubmission } from '@/lib/services/submissions'

export function useGradeSubmission(id: string) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => gradeSubmission(id),
    onSettled: () => queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
  })
}
