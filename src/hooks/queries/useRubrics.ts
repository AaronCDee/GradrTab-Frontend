import { queryOptions, useQuery } from '@tanstack/react-query'

import { getRubric, listRubrics } from '@/lib/services/rubrics'

export const rubricKeys = {
  all: ['rubrics'] as const,
  detail: (id: string) => ['rubrics', id] as const,
}

export const rubricsQueryOptions = queryOptions({
  queryKey: rubricKeys.all,
  queryFn: listRubrics,
})

export const rubricQueryOptions = (id: string) =>
  queryOptions({
    queryKey: rubricKeys.detail(id),
    queryFn: () => getRubric(id),
  })

export const useRubrics = () => useQuery(rubricsQueryOptions)
