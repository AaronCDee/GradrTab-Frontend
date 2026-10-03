import { createFileRoute } from '@tanstack/react-router'

import { RubricBuilder } from '@/components/rubric/RubricBuilder'

const NewRubricPage = () => (
  <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
    <RubricBuilder />
  </div>
)

export const Route = createFileRoute('/_authenticated/rubrics/new')({
  staticData: { title: 'New rubric' },
  component: NewRubricPage,
})
