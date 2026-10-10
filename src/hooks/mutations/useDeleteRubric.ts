import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { rubricKeys, rubricsQueryOptions } from '@/hooks/queries/useRubrics'
import { submissionKeys } from '@/hooks/queries/useSubmissions'
import { deleteRubric } from '@/lib/services/rubrics'

export function useDeleteRubric() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: deleteRubric,
    onSuccess: async (_, id) => {
      queryClient.setQueryData(rubricsQueryOptions.queryKey, (rubrics) =>
        rubrics?.filter((rubric) => rubric.id !== id),
      )
      await navigate({ to: '/rubrics' })
      queryClient.removeQueries({ queryKey: rubricKeys.detail(id) })
      await queryClient.invalidateQueries({ queryKey: submissionKeys.all })
    },
  })
}
