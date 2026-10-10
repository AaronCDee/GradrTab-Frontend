import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { documentKeys } from '@/hooks/queries/useDocuments'
import { submissionKeys } from '@/hooks/queries/useSubmissions'
import type { Submission, SubmissionFormValues } from '@/lib/schemas/submission'
import { updateSubmission } from '@/lib/services/submissions'

export function useUpdateSubmission() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ submission, values }: { submission: Submission; values: SubmissionFormValues }) =>
      updateSubmission(submission, values),
    onSuccess: async () => {
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: submissionKeys.all }),
        queryClient.invalidateQueries({ queryKey: documentKeys.all }),
      ])
      await navigate({ to: '/submissions' })
    },
  })
}
