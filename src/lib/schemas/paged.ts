import { z } from 'zod'

export const pagedSchema = <T extends z.ZodType>(item: T) =>
  z.object({
    items: z.array(item),
    totalCount: z.number(),
    totalPages: z.number(),
  })
