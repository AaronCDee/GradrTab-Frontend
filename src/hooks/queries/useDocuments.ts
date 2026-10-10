import { queryOptions, useQuery } from '@tanstack/react-query'

import { getDocument, listDocuments } from '@/lib/services/documents'

export const documentKeys = {
  all: ['documents'] as const,
  detail: (id: string) => ['documents', id] as const,
}

export const documentsQueryOptions = queryOptions({
  queryKey: documentKeys.all,
  queryFn: listDocuments,
})

export const documentQueryOptions = (id: string) =>
  queryOptions({
    queryKey: documentKeys.detail(id),
    queryFn: () => getDocument(id),
  })

export const useDocuments = () => useQuery(documentsQueryOptions)
