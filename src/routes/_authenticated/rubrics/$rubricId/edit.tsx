import { createFileRoute, redirect } from '@tanstack/react-router'

import { RubricBuilder } from '@/components/rubric/RubricBuilder'
import { useUpdateRubric } from '@/hooks/mutations/useUpdateRubric'
import { rubricQueryOptions } from '@/hooks/queries/useRubrics'

const EditRubricPage = () => {
  const { rubric } = Route.useLoaderData()
  const updateRubric = useUpdateRubric()

  return (
    <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
      <RubricBuilder
        defaultValues={{
          title: rubric.title,
          courseName: rubric.courseName,
          courseId: rubric.courseId,
          criteria: rubric.criteria,
        }}
        submitLabel="Save changes"
        pending={updateRubric.isPending}
        error={updateRubric.error}
        onSubmit={(values) => updateRubric.mutate({ id: rubric.id, values })}
      />
    </div>
  )
}

export const Route = createFileRoute('/_authenticated/rubrics/$rubricId/edit')({
  staticData: { title: 'Edit rubric' },
  loader: async ({ context, params }) => {
    const rubric = await context.queryClient.ensureQueryData(rubricQueryOptions(params.rubricId))
    if (!rubric) throw redirect({ to: '/rubrics' })
    return { rubric }
  },
  component: EditRubricPage,
})
