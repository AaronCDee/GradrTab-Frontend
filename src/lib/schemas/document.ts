import { z } from 'zod'

export const documentSchema = z.object({
  id: z.string(),
  originalFileName: z.string(),
  fileSizeBytes: z.number(),
  status: z.enum(['Pending', 'Processing', 'Completed', 'Failed']),
  errorMessage: z.string().nullable(),
})

export const documentUploadSchema = z.object({
  results: z.tuple([z.object({ id: z.string() })]),
})

export type Document = z.infer<typeof documentSchema>
