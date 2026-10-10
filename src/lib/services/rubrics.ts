import { z } from 'zod'

import { ApiError, apiFetch } from '@/lib/api'
import { pagedSchema } from '@/lib/schemas/paged'
import {
  rubricResponseSchema,
  rubricSummarySchema,
  storedRubricSchema,
  type Rubric,
  type RubricFormValues,
  type RubricResponse,
} from '@/lib/schemas/rubric'

const parseContent = (content: string) => {
  try {
    return storedRubricSchema.parse(JSON.parse(content))
  } catch {
    return null
  }
}

const toRubric = ({ rubricContent, ...rubric }: RubricResponse): Rubric => ({
  ...rubric,
  ...(parseContent(rubricContent) ?? { title: rubric.courseName, criteria: [] }),
})

const toRequestBody = ({ title, criteria, ...course }: RubricFormValues) =>
  JSON.stringify({ ...course, rubricContent: JSON.stringify({ title, criteria }) })

export async function getRubric(id: string): Promise<Rubric | null> {
  try {
    return toRubric(await apiFetch(`/rubrics/${id}`, rubricResponseSchema))
  } catch (error) {
    if (error instanceof ApiError && error.status === 404) return null
    throw error
  }
}

export async function listRubrics(): Promise<Rubric[]> {
  const { items } = await apiFetch('/rubrics?pageSize=200', pagedSchema(rubricSummarySchema))
  const rubrics = await Promise.all(items.map(({ id }) => getRubric(id)))
  return rubrics
    .filter((rubric) => rubric !== null)
    .toSorted((a, b) => a.title.localeCompare(b.title))
}

export async function createRubric(values: RubricFormValues): Promise<Rubric> {
  const rubric = await apiFetch('/rubrics', rubricResponseSchema, {
    method: 'POST',
    body: toRequestBody(values),
  })
  return toRubric(rubric)
}

export async function updateRubric(id: string, values: RubricFormValues): Promise<Rubric> {
  const rubric = await apiFetch(`/rubrics/${id}`, rubricResponseSchema, {
    method: 'PUT',
    body: toRequestBody(values),
  })
  return toRubric(rubric)
}

export const deleteRubric = (id: string) =>
  apiFetch(`/rubrics/${id}`, z.null(), { method: 'DELETE' })
