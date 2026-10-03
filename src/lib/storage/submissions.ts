import { createStore, del, get, set, values } from 'idb-keyval'
import { z } from 'zod'

import {
  submissionSchema,
  type Submission,
  type SubmissionFormValues,
} from '@/lib/schemas/submission'

const store = createStore('gradrtab-submissions', 'submissions')

export async function listSubmissions(): Promise<Submission[]> {
  const submissions = z.array(submissionSchema).parse(await values(store))
  return submissions.toSorted((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function getSubmission(id: string): Promise<Submission | null> {
  const submission: unknown = await get(id, store)
  return submission ? submissionSchema.parse(submission) : null
}

export async function createSubmission(input: SubmissionFormValues): Promise<Submission> {
  const now = new Date().toISOString()
  const submission = { id: crypto.randomUUID(), ...input, createdAt: now, updatedAt: now }
  await set(submission.id, submission, store)
  return submission
}

export async function updateSubmission(
  id: string,
  input: SubmissionFormValues,
): Promise<Submission> {
  const existing = await getSubmission(id)
  if (!existing) throw new Error('Submission not found')

  const submission = { ...existing, ...input, updatedAt: new Date().toISOString() }
  await set(id, submission, store)
  return submission
}

export const deleteSubmission = (id: string) => del(id, store)
