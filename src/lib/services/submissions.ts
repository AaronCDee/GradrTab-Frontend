import { z } from 'zod'

import { ApiError, apiFetch, withErrorMessages } from '@/lib/api'
import { pagedSchema } from '@/lib/schemas/paged'
import {
  evaluationSchema,
  gradingEmailSchema,
  submissionSchema,
  submissionSummarySchema,
  type Submission,
  type SubmissionFormValues,
  type SubmissionSummary,
} from '@/lib/schemas/submission'
import { deleteDocument, uploadDocument } from '@/lib/services/documents'

export const listSubmissions = async () =>
  (await apiFetch('/submissions?pageSize=200', pagedSchema(submissionSummarySchema))).items

export async function getSubmission(id: string): Promise<Submission | null> {
  try {
    return await apiFetch(`/submissions/${id}`, submissionSchema)
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function createSubmission({ file, documentId, ...values }: SubmissionFormValues) {
  return apiFetch('/submissions', submissionSchema, {
    method: 'POST',
    body: JSON.stringify({
      ...values,
      documentId: file ? await uploadDocument(file) : documentId,
    }),
  })
}

export async function updateSubmission(
  existing: Submission,
  { file, documentId, ...values }: SubmissionFormValues,
) {
  const updated = await apiFetch(`/submissions/${existing.id}`, submissionSchema, {
    method: 'PUT',
    body: JSON.stringify({
      ...values,
      documentId: file ? await uploadDocument(file) : documentId,
      evaluation: existing.evaluation ? JSON.stringify(existing.evaluation) : null,
    }),
  })
  if (file && existing.documentId) await deleteDocument(existing.documentId).catch(() => {})
  return updated
}

export async function deleteSubmission({ id, documentId }: SubmissionSummary) {
  await apiFetch(`/submissions/${id}`, z.null(), { method: 'DELETE' })
  if (documentId) await deleteDocument(documentId).catch(() => {})
}

export const gradeSubmission = (id: string) =>
  apiFetch(`/submissions/${id}/grade`, evaluationSchema, {
    method: 'POST',
    body: JSON.stringify({}),
  }).catch(
    withErrorMessages(
      {
        422: "This submission can't be graded yet. Make sure it has a rubric and a file with enough readable text.",
      },
      "Grading isn't available right now. Please try again in a few minutes.",
    ),
  )

export const emailSubmission = (id: string, graderEmail: string) =>
  apiFetch(`/submissions/${id}/email-grading-result`, gradingEmailSchema, {
    method: 'POST',
    body: JSON.stringify({ graderEmail }),
  }).catch(
    withErrorMessages(
      {
        422: "This submission can't be emailed until it's been graded.",
        503: "Email isn't set up on the server yet.",
      },
      "We couldn't send the email right now. Please try again in a few minutes.",
    ),
  )
