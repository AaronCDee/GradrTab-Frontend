import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { rubricKeys, rubricQueryOptions } from '@/hooks/queries/useRubrics'
import type { RubricFormValues } from '@/lib/schemas/rubric'
import { updateRubric } from '@/lib/services/rubrics'

export function useUpdateRubric() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: ({ id, values }: { id: string; values: RubricFormValues }) =>
      updateRubric(id, values),
    onSuccess: async (rubric) => {
      queryClient.setQueryData(rubricQueryOptions(rubric.id).queryKey, rubric)
      await queryClient.invalidateQueries({ queryKey: rubricKeys.all })
      await navigate({ to: '/rubrics' })
    },
  })
}
