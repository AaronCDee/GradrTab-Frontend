import { queryOptions, useQuery } from '@tanstack/react-query'

import { getSubmission, listSubmissions } from '@/lib/services/submissions'

export const submissionKeys = {
  all: ['submissions'] as const,
  detail: (id: string) => ['submissions', id] as const,
}

export const submissionsQueryOptions = queryOptions({
  queryKey: submissionKeys.all,
  queryFn: listSubmissions,
})

export const submissionQueryOptions = (id: string) =>
  queryOptions({
    queryKey: submissionKeys.detail(id),
    queryFn: () => getSubmission(id),
    refetchInterval: (query) => (query.state.data?.gradingStatus === 'InProgress' ? 3000 : false),
  })

export const useSubmissions = () => useQuery(submissionsQueryOptions)
