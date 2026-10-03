import { createStore, set, values } from 'idb-keyval'
import { z } from 'zod'

import { rubricSchema, type Rubric, type RubricFormValues } from '@/lib/schemas/rubric'

const store = createStore('gradrtab-rubrics', 'rubrics')

export async function listRubrics(): Promise<Rubric[]> {
  const rubrics = z.array(rubricSchema).parse(await values(store))
  return rubrics.toSorted((a, b) => a.title.localeCompare(b.title))
}

export async function createRubric(input: RubricFormValues): Promise<Rubric> {
  const rubric = { id: crypto.randomUUID(), ...input }
  await set(rubric.id, rubric, store)
  return rubric
}
