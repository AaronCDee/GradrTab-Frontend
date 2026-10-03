import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'

import { rubricKeys } from '@/hooks/queries/useRubrics'
import { createRubric } from '@/lib/storage/rubrics'

export function useCreateRubric() {
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  return useMutation({
    mutationFn: createRubric,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: rubricKeys.all })
      await navigate({ to: '/rubrics' })
    },
  })
}
