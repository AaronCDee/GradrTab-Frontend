import { apiFetch } from '@/lib/api'
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

export async function getRubric(id: string): Promise<Rubric> {
  return toRubric(await apiFetch(`/rubrics/${id}`, rubricResponseSchema))
}

export async function listRubrics(): Promise<Rubric[]> {
  const { items } = await apiFetch('/rubrics?pageSize=200', pagedSchema(rubricSummarySchema))
  const rubrics = await Promise.all(items.map(({ id }) => getRubric(id)))
  return rubrics.toSorted((a, b) => a.title.localeCompare(b.title))
}

export async function createRubric({
  title,
  criteria,
  ...course
}: RubricFormValues): Promise<Rubric> {
  const rubric = await apiFetch('/rubrics', rubricResponseSchema, {
    method: 'POST',
    body: JSON.stringify({ ...course, rubricContent: JSON.stringify({ title, criteria }) }),
  })
  return toRubric(rubric)
}
