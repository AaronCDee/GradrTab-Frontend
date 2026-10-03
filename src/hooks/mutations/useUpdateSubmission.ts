import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { submissionKeys } from '@/hooks/queries/useSubmissions'
import type { SubmissionFormValues } from '@/lib/schemas/submission'
import { updateSubmission } from '@/lib/storage/submissions'

export function useUpdateSubmission() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: SubmissionFormValues }) =>
      updateSubmission(id, values),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: submissionKeys.all })
      await navigate({ to: '/submissions' })
    },
  })
}
