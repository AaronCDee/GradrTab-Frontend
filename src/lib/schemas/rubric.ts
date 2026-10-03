import { z } from 'zod'

export const rubricLevelSchema = z.object({
  label: z.string().trim().min(1, 'Label is required'),
  points: z.number({ error: 'Enter a number' }).min(0, 'Points cannot be negative'),
  description: z.string().trim(),
})

export const rubricCriterionSchema = z
  .object({
    id: z.string(),
    name: z.string().trim().min(1, 'Criterion name is required'),
    levels: z.array(rubricLevelSchema).min(1, 'Add at least one level'),
  })
  .superRefine((criterion, ctx) => {
    const seen = new Set<string>()
    criterion.levels.forEach((level, index) => {
      const key = level.label.toLowerCase()
      if (seen.has(key)) {
        ctx.addIssue({
          code: 'custom',
          message: 'Labels must be unique',
          path: ['levels', index, 'label'],
        })
      }
      seen.add(key)
    })
  })

export const rubricFormSchema = z.object({
  title: z.string().trim().min(1, 'Title is required'),
  criteria: z.array(rubricCriterionSchema).min(1, 'Add at least one criterion'),
})

export const rubricSchema = rubricFormSchema.extend({ id: z.string() })

export type RubricLevel = z.infer<typeof rubricLevelSchema>
export type RubricCriterion = z.infer<typeof rubricCriterionSchema>
export type RubricFormValues = z.infer<typeof rubricFormSchema>
export type Rubric = z.infer<typeof rubricSchema>
