import { createFileRoute } from '@tanstack/react-router'

import { RubricBuilder } from '@/components/rubric/RubricBuilder'
import { useCreateRubric } from '@/hooks/mutations/useCreateRubric'

const NewRubricPage = () => {
  const createRubric = useCreateRubric()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <RubricBuilder
        submitLabel="Save rubric"
        pending={createRubric.isPending}
        error={createRubric.error}
        onSubmit={(values) => createRubric.mutate(values)}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/rubrics/new')({
  staticData: { title: 'New rubric' },
  component: NewRubricPage,
})
