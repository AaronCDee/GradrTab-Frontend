import { queryOptions, useQuery } from '@tanstack/react-query'

import { listRubrics } from '@/lib/storage/rubrics'

export const rubricKeys = {
  all: ['rubrics'] as const,
}

export const rubricsQueryOptions = queryOptions({
  queryKey: rubricKeys.all,
  queryFn: listRubrics,
})

export const useRubrics = () => useQuery(rubricsQueryOptions)
