import { z } from 'zod'

const ACCEPTED_EXTENSIONS = ['.pdf', '.csv']

export const submissionFormSchema = z
  .object({
    studentId: z.string().trim().min(1, 'Student ID is required'),
    studentName: z.string().trim().min(1, 'Student name is required'),
    rubricId: z.string().min(1, 'Select a rubric'),
    documentId: z.string().optional(),
    file: z
      .instanceof(File)
      .refine(
        (file) => ACCEPTED_EXTENSIONS.some((extension) => file.name.toLowerCase().endsWith(extension)),
        'File must be a PDF or CSV',
      )
      .optional(),
  })
  .refine((values) => values.file || values.documentId, {
    message: 'Choose a file to upload',
    path: ['file'],
    when: () => true,
  })

export const gradingStatusSchema = z.enum(['NotStarted', 'InProgress', 'Complete', 'Failure'])

export const criterionEvaluationSchema = z.object({
  name: z.string(),
  score: z.number().nullable(),
  maxScore: z.number().nullable(),
  comments: z.string().nullable(),
})

export const evaluationSchema = z.object({
  submissionId: z.string(),
  rubricId: z.string().nullable(),
  documentId: z.string().nullable(),
  studentId: z.string(),
  studentName: z.string(),
  courseName: z.string(),
  courseId: z.string(),
  overallScore: z.number().nullable(),
  maxScore: z.number().nullable(),
  percentage: z.number().nullable(),
  grade: z.string().nullable(),
  summary: z.string().nullable(),
  criteria: z.array(criterionEvaluationSchema),
  strengths: z.array(z.string()),
  improvements: z.array(z.string()),
  assessmentTruncated: z.boolean(),
  model: z.string(),
  evaluatedAt: z.string(),
})

export const submissionSchema = z.object({
  id: z.string(),
  rubricId: z.string().nullable(),
  documentId: z.string().nullable(),
  studentId: z.string(),
  studentName: z.string(),
  evaluation: evaluationSchema.nullable(),
  gradingStatus: gradingStatusSchema,
  failureReason: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
})

export const submissionSummarySchema = submissionSchema.omit({
  evaluation: true,
  failureReason: true,
})

export type SubmissionFormValues = z.infer<typeof submissionFormSchema>
export type GradingStatus = z.infer<typeof gradingStatusSchema>
export type Evaluation = z.infer<typeof evaluationSchema>
export type Submission = z.infer<typeof submissionSchema>
export type SubmissionSummary = z.infer<typeof submissionSummarySchema>
