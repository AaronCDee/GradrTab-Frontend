import { z } from 'zod'

const ACCEPTED_EXTENSIONS = ['.pdf', '.csv']

export const submissionFormSchema = z.object({
  studentId: z.string().trim().min(1, 'Student ID is required'),
  studentName: z.string().trim().min(1, 'Student name is required'),
  rubricId: z.string().min(1, 'Select a rubric'),
  file: z
    .instanceof(File, { error: 'Choose a file to upload' })
    .refine(
      (file) => ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)),
      'File must be a PDF or CSV',
    ),
})

export const submissionSchema = submissionFormSchema.extend({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>
export type Submission = z.infer<typeof submissionSchema>
